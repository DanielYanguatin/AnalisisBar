export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800'>
      <div className='bg-white p-8 rounded-2xl shadow-xl text-center max-w-md'>
        <h1 className='text-3xl font-bold mb-4'>¡Bienvenido, Administrador!</h1>
        <p className='text-lg mb-6'>Has ingresado al panel de control del sistema de inventario.</p>
        <p className='text-sm text-gray-500'>Desde aquí puedes gestionar productos, usuarios y más.</p>
      </div>
    </div>
  );
}
