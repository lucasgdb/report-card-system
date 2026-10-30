type ReportCardSectionProps = {
  /** Shown under the title (e.g. when an offline copy was saved). */
  description?: React.ReactNode;
  children: React.ReactNode;
};

const titleClassName = 'font-heading text-2xl leading-[30px] font-semibold text-(--text-title)';

/** "Boletim escolar" section of the home page (online and offline). */
export default function ReportCardSection({ description, children }: ReportCardSectionProps) {
  return (
    <section aria-labelledby="boletim-titulo" className="px-5 py-12 min-[600px]:px-[8%] min-[600px]:py-16">
      <h2 id="boletim-titulo" className={titleClassName}>
        Boletim escolar
      </h2>
      {description && <p className="mt-1 text-sm text-pretty text-(--text-muted)">{description}</p>}

      <div className="mt-8">{children}</div>
    </section>
  );
}

type ReportCardEmptyProps = {
  title: string;
  description: string;
};

export function ReportCardEmpty({ title, description }: ReportCardEmptyProps) {
  return (
    <section className="px-5 py-12 min-[600px]:px-[8%] min-[600px]:py-16">
      <h2 className={titleClassName}>{title}</h2>
      <p className="mt-2 max-w-prose text-base text-pretty text-(--text-muted)">{description}</p>
    </section>
  );
}
