import { DataTable, type GridColDef, type GridRowsProp } from '@usefaz/ui/components/data-table';
import { PageHeader } from '@usefaz/ui/components/page-header';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@usefaz/ui/components/ui/input-group';
import { SearchIcon, XIcon } from 'lucide-react';
import { useDeferredValue, useRef, useState } from 'react';
import { graphql, useFragment } from 'react-relay';

import MoreButton from './MoreButton';
import UploadButton from './Upload/UploadButton';
import type { StudentList_admin$key } from './__generated__/StudentList_admin.graphql';

const plural = new Intl.PluralRules('pt-BR');

// Accents and case don't matter when searching ("joao" finds "João").
const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

type StudentListProps = {
  admin: StudentList_admin$key;
};

export default function StudentList({ admin }: StudentListProps) {
  const data = useFragment<StudentList_admin$key>(
    graphql`
      fragment StudentList_admin on Admin {
        ...MoreButton_admin
        ...UploadButton_admin
        students(first: 100) @connection(key: "StudentList_students") {
          edges {
            node {
              id
              RM
              fullname
            }
          }
        }
      }
    `,
    admin
  );

  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  // Filtering doesn't block typing.
  const query = normalize(useDeferredValue(search).trim());

  const students = (data.students?.edges ?? []).map(({ node }) => node);
  const total = students.length;

  const columns: GridColDef[] = [
    { field: 'RM', cellClassName: 'tabular-nums text-muted-foreground', headerName: 'RM', width: 96 },
    { field: 'fullname', headerName: 'Nome', flex: 1, width: 160, cellClassName: 'font-medium text-foreground' },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 88,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell(params) {
        return <MoreButton params={params} admin={data} />;
      },
    },
  ];

  const rows: GridRowsProp = students
    .filter((student) => !query || normalize(student.fullname).includes(query) || student.RM.includes(query))
    .map((student) => ({ id: student.id, RM: student.RM, fullname: student.fullname }));

  return (
    <>
      <PageHeader
        title="Alunos"
        description={`${total} ${plural.select(total) === 'one' ? 'aluno cadastrado' : 'alunos cadastrados'}`}
        actions={
          <>
            <InputGroup className="w-full sm:w-64">
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                ref={searchRef}
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nome ou RM…"
                aria-label="Buscar alunos por nome ou RM"
                autoComplete="off"
              />
              {search && (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-sm"
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Limpar busca"
                    onClick={() => {
                      setSearch('');
                      searchRef.current?.focus();
                    }}
                  >
                    <XIcon />
                  </InputGroupButton>
                </InputGroupAddon>
              )}
            </InputGroup>
            <UploadButton admin={data} />
          </>
        }
      />

      <DataTable
        rows={rows}
        columns={columns}
        emptyMessage={
          query
            ? 'Nenhum aluno encontrado com essa busca.'
            : 'Nenhum aluno ainda. Carregue a planilha de notas para cadastrar os alunos.'
        }
      />
    </>
  );
}
