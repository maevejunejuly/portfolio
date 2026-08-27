import Image from "next/image";

type ImageSlotProps = {
  src?: string;
  placeholder: string;
  fit?: "cover" | "contain";
  className?: string;
  priority?: boolean;
};

export default function ImageSlot({
  src,
  placeholder,
  fit = "cover",
  className = "",
  priority,
}: ImageSlotProps) {
  if (src) {
    return (
      <div className={`relative h-full w-full ${className}`}>
        <Image
          src={src}
          alt={placeholder}
          fill
          sizes="(max-width:1024px) 100vw, 50vw"
          priority={priority}
          className={fit === "contain" ? "object-contain" : "object-cover"}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-surface p-4 ${className}`}
    >
      <span className="font-label text-center text-label uppercase leading-relaxed text-fg/45">
        {placeholder}
      </span>
    </div>
  );
}
