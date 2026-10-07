interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  return (
    <div className={`max-w-2xl ${isCenter ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <span className="inline-block text-brand font-semibold text-sm tracking-wide uppercase mb-2">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold text-heading tracking-tight">{title}</h2>
      {description && <p className="mt-3 text-body leading-relaxed">{description}</p>}
    </div>
  );
}
