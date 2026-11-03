import { FileDropzone } from '@usefaz/ui/components/file-dropzone';
import { SpreadsheetPreview } from '@usefaz/ui/components/spreadsheet-preview';
import { Badge } from '@usefaz/ui/components/ui/badge';
import { Button } from '@usefaz/ui/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@usefaz/ui/components/ui/dialog';
import { FieldError } from '@usefaz/ui/components/ui/field';
import { toast } from '@usefaz/ui/components/ui/sonner';
import { DownloadIcon } from 'lucide-react';
import { environment } from '@usefaz/relay';
import { commitLocalUpdate, graphql, useFragment } from 'react-relay';
import { authorizedFetch } from '@usefaz/shared/browser';
import { ConnectionHandler } from 'relay-runtime';
import { useRef, useState } from 'react';

import type { UploadDialog_admin$key } from './__generated__/UploadDialog_admin.graphql';

/** The columns the server reads (`apps/server/src/http/uploads.ts`), in the model's order. */
const COLUMNS = [
  'ano',
  'rm',
  'nome',
  'senha',
  'disciplina',
  ...[1, 2, 3, 4].flatMap((bimester) => [`nota_${bimester}bim`, `recuperacao_${bimester}bim`, `faltas_${bimester}bim`]),
];

const DELIMITER = '|';

function sampleRows(disciplineCodes: number[]) {
  const year = String(new Date().getFullYear());
  const [first = 1, second = 2] = disciplineCodes;
  // The second line shows bimesters not graded yet (empty cells).
  return [
    [
      year,
      '20240',
      'Maria Souza',
      'usefaz123',
      String(first),
      '8,5',
      '-',
      '2',
      '7',
      '-',
      '0',
      '9',
      '-',
      '1',
      '6',
      '7,5',
      '3',
    ],
    [
      year,
      '20240',
      'Maria Souza',
      'usefaz123',
      String(second),
      '10',
      '-',
      '0',
      '9,5',
      '-',
      '1',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  ];
}

function downloadModel(rows: string[][]) {
  const content = [COLUMNS, ...rows].map((row) => row.join(DELIMITER)).join('\n');
  const url = URL.createObjectURL(new Blob([`${content}\n`], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'modelo-notas.csv';
  link.click();
  URL.revokeObjectURL(url);
}

/** A quick look at the file before sending it: the columns it lacks, or how many lines and students it has. */
async function inspect(file: File) {
  const lines = (await file.text()).split(/\r?\n/).filter((line) => line.trim());
  const header = (lines[0] ?? '').split(DELIMITER).map((column) => column.trim());
  const missing = COLUMNS.filter((column) => !header.includes(column));
  const rmIndex = header.indexOf('rm');
  const students = new Set(lines.slice(1).map((line) => line.split(DELIMITER)[rmIndex]?.trim()));
  return { missing, lines: lines.length - 1, students: students.size };
}

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

type UploadDialogProps = {
  open: boolean;
  onClose(): void;
  admin: UploadDialog_admin$key;
};

export default function UploadDialog({ open, onClose, admin }: UploadDialogProps) {
  const data = useFragment<UploadDialog_admin$key>(
    graphql`
      fragment UploadDialog_admin on Admin {
        id
        disciplines {
          code
          name
        }
      }
    `,
    admin
  );

  const dropzoneRef = useRef<HTMLButtonElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState('');
  const [fileError, setFileError] = useState('');
  const [loading, setLoading] = useState(false);

  const rows = sampleRows(data.disciplines.map(({ code }) => code));

  async function handleFileChange(nextFile: File | null) {
    setFile(nextFile);
    setSummary('');
    setFileError('');
    if (!nextFile) {
      return;
    }

    const { missing, lines, students } = await inspect(nextFile);
    if (missing.length) {
      const listed = missing.slice(0, 3).join(', ');
      const more = missing.length > 3 ? ` e mais ${missing.length - 3}` : '';
      setFileError(`O arquivo não segue o modelo. Faltam as colunas ${listed}${more}.`);
    } else if (!lines) {
      setFileError('O arquivo não tem nenhuma linha de notas.');
    } else {
      setSummary(`${plural(lines, 'linha', 'linhas')} · ${plural(students, 'aluno', 'alunos')}`);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setFileError('Selecione o arquivo .csv com as notas.');
      dropzoneRef.current?.focus();
      return;
    }
    if (fileError) {
      return;
    }

    const formData = new FormData();
    formData.append('csv', file);

    try {
      setLoading(true);

      const response = await authorizedFetch(`${process.env.SERVER_BASE_URL}/admin/student/upload`, {
        method: 'POST',
        body: formData,
      });
      const uploaded = await response.json();
      if (!response.ok) {
        setFileError(uploaded.message ?? 'Não foi possível carregar as notas.');
        return;
      }

      commitLocalUpdate(environment, (store) => {
        const admin = store.get(data.id);

        const students = ConnectionHandler.getConnection(admin, 'StudentList_students');

        for (const { node: student } of uploaded.students.edges) {
          const linkedRecord = store.get(student.id);
          if (!linkedRecord) {
            const newLinkedRecord = store.create(student.id, 'Student');
            newLinkedRecord.setValue(student.id, 'id');
            newLinkedRecord.setValue(student.RM, 'RM');
            newLinkedRecord.setValue(student.fullname, 'fullname');
            const newEdge = ConnectionHandler.createEdge(store, students, newLinkedRecord, 'StudentEdge');

            ConnectionHandler.insertEdgeAfter(students, newEdge);
          }
        }
      });

      toast.success('Notas carregadas com sucesso.');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Não foi possível carregar as notas. Confira sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
      onOpenChangeComplete={(nextOpen) => {
        if (!nextOpen) {
          setFile(null);
          setSummary('');
          setFileError('');
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit} className="grid min-w-0 gap-6">
          <DialogHeader>
            <DialogTitle>Carregar notas</DialogTitle>
            <DialogDescription>
              Envie a planilha com as notas do ano. Alunos novos são cadastrados e os boletins de quem já existe são
              atualizados. Para mudar poucas notas, use "Editar notas" no aluno.
            </DialogDescription>
          </DialogHeader>

          <section className="grid min-w-0 gap-3" aria-labelledby="upload-format">
            <div className="flex items-center justify-between gap-3">
              <h2 id="upload-format" className="text-sm font-semibold text-foreground">
                Formato do arquivo
              </h2>
              <Button type="button" variant="outline" size="sm" onClick={() => downloadModel(rows)}>
                <DownloadIcon />
                Baixar modelo
              </Button>
            </div>

            <SpreadsheetPreview columns={COLUMNS} rows={rows} aria-label="Exemplo de planilha de notas" />

            <ul className="grid list-disc gap-1 pl-5 text-sm text-muted-foreground marker:text-border">
              <li>
                Uma linha por aluno e disciplina, com as colunas separadas por{' '}
                <code className="font-mono text-foreground">|</code>.
              </li>
              <li>
                Notas de 0 a 10, com vírgula ou ponto. Deixe vazio o que ainda não foi lançado (ou use{' '}
                <code className="font-mono text-foreground">-</code> quando não houver recuperação).
              </li>
              <li>
                Aluno que já existe (mesmo <code className="font-mono text-foreground">rm</code>) mantém nome e senha:
                só as notas das disciplinas da planilha são substituídas.
              </li>
              <li>A senha (mínimo de 8 caracteres) só é obrigatória para alunos novos.</li>
              <li>
                Para só cadastrar o aluno, sem notas ainda, deixe{' '}
                <code className="font-mono text-foreground">disciplina</code> vazia.
              </li>
              <li>
                Em <code className="font-mono text-foreground">disciplina</code>, use o código da disciplina:
              </li>
            </ul>
            <ul className="flex flex-wrap gap-1.5" aria-label="Códigos das disciplinas">
              {data.disciplines.map(({ code, name }) => (
                <li key={code}>
                  <Badge variant="outline" className="font-normal text-muted-foreground">
                    <span className="font-mono font-medium text-foreground">{code}</span>
                    {name}
                  </Badge>
                </li>
              ))}
            </ul>
          </section>

          <div className="grid gap-2">
            <FileDropzone
              ref={dropzoneRef}
              file={file}
              onFileChange={handleFileChange}
              accept=".csv"
              hint="Arquivo .csv de até 5 MB"
              details={summary}
              invalid={Boolean(fileError)}
              aria-describedby={fileError ? 'csv-error' : undefined}
            />
            <FieldError id="csv-error">{fileError}</FieldError>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
            <Button type="submit" loading={loading}>
              Carregar notas
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
