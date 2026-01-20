import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 font-sans p-6 text-center">
      <div className="max-w-2xl w-full space-y-8 bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-center">
          <div className="bg-blue-600 p-4 rounded-2xl">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Plataforma Educativa
            <span className="block text-blue-600">SaaS Intranet</span>
          </h1>
          <p className="max-w-md mx-auto text-lg text-gray-600">
            Gestión escolar optimizada para instituciones modernas. Control administrativo, docente y estudiantil en un solo lugar.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Ingresar al Sistema
            <ArrowRight className="h-5 w-5" />
          </Link>

          <Link
            href="https://github.com"
            target="_blank"
            className="flex items-center justify-center px-8 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Soporte Técnico
          </Link>
        </div>

        <div className="pt-8 text-sm text-gray-400">
          Desarrollado para instituciones educativas de alto rendimiento.
        </div>
      </div>
    </div>
  );
}
