'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '@/actions/create-user';
import { useUser } from '@/context/UserContext';
import { Loader2, UserPlus, CheckCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateUserPage() {
    const { school } = useUser();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setGeneratedPassword(null);

        const formData = new FormData(e.currentTarget);

        const data = {
            first_name: formData.get('first_name') as string,
            last_name: formData.get('last_name') as string,
            dni: formData.get('dni') as string,
            email: formData.get('email') as string,
            role: formData.get('role') as 'student' | 'teacher',
            school_id: school?.id || '',
        };

        if (!data.school_id) {
            toast.error('Error: No se ha identificado el colegio.');
            setIsLoading(false);
            return;
        }

        try {
            const result = await createUser(data);

            if (result.success && result.data) {
                toast.success('Usuario creado exitosamente');
                setGeneratedPassword(result.data.password);
                e.currentTarget.reset();
            } else {
                toast.error(result.error || 'Error al crear usuario');
            }
        } catch (error) {
            toast.error('Error inesperado al crear el usuario.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (generatedPassword) {
            navigator.clipboard.writeText(generatedPassword);
            toast.success('Contraseña copiada al portapapeles');
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Registrar Nuevo Usuario
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Crea cuentas para alumnos o docentes. Se generará una contraseña temporal automática.
                    </p>
                </div>
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                <form onSubmit={handleSubmit} className="px-4 py-6 sm:p-8">
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                        {/* Nombre */}
                        <div className="sm:col-span-3">
                            <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">
                                Nombre(s)
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="first_name"
                                    id="first_name"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 pl-2"
                                />
                            </div>
                        </div>

                        {/* Apellido */}
                        <div className="sm:col-span-3">
                            <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900">
                                Apellido(s)
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="last_name"
                                    id="last_name"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 pl-2"
                                />
                            </div>
                        </div>

                        {/* DNI */}
                        <div className="sm:col-span-3">
                            <label htmlFor="dni" className="block text-sm font-medium leading-6 text-gray-900">
                                DNI / Documento
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="dni"
                                    id="dni"
                                    required
                                    inputMode="numeric"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 pl-2"
                                />
                            </div>
                        </div>

                        {/* Rol */}
                        <div className="sm:col-span-3">
                            <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
                                Rol del Usuario
                            </label>
                            <div className="mt-2">
                                <select
                                    id="role"
                                    name="role"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6 pl-2"
                                >
                                    <option value="student">Alumno</option>
                                    <option value="teacher">Docente</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="sm:col-span-4">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Correo Electrónico
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 pl-2"
                                    placeholder="usuario@ejemplo.com"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Se usará para iniciar sesión.
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Result and Actions */}
                    <div className="mt-8 flex items-center justify-end gap-x-6 border-t border-gray-900/10 pt-8">
                        {generatedPassword && (
                            <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between mr-4">
                                <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                                    <div>
                                        <p className="text-sm font-medium text-green-800">Usuario Creado</p>
                                        <p className="text-sm text-green-700 mt-1">
                                            Contraseña temporal: <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-green-300 select-all">{generatedPassword}</span>
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={copyToClipboard}
                                    className="p-2 text-green-600 hover:bg-green-100 rounded-full"
                                    title="Copiar contraseña"
                                >
                                    <Copy className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                    Creando...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="-ml-1 mr-2 h-4 w-4" />
                                    Crear Usuario
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
