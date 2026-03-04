import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-bg-lavender px-4 text-center">
      <h1 className="font-heading text-6xl font-bold text-primary">404</h1>
      <p className="mt-4 text-xl text-text-body">
        Pagina nao encontrada
      </p>
      <p className="mt-2 text-text-body">
        A pagina que voce procura nao existe ou foi movida.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full border-2 border-primary px-8 py-3 font-medium text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Voltar para o inicio
      </Link>
    </div>
  );
}
