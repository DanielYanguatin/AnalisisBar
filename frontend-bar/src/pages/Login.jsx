import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ShoppingCartIcon, LockClosedIcon, EnvelopeIcon, ArrowRightIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

function Login({ setAutenticado, setRol }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/usuarios/ingresar", {
        correo,
        contraseña: contrasena,
      });

      const { usuario } = res.data;
      localStorage.setItem("usuario", JSON.stringify(usuario));
      setAutenticado(true);
      setRol(usuario.rol);

      if (usuario.rol === "cliente") {
        navigate("/cliente");
      } else if (usuario.rol === "admin") {
        navigate("/admin");
      } else if (usuario.rol === "cajero") {
        navigate("/cajero");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.mensaje || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen relative'>
      {/* Fondo con imagen y overlay */}
      <div className='absolute inset-0'>
        <div
          className="absolute inset-0 bg-[url('/fondo-login.jpg')] bg-cover bg-center"
          style={{
            backgroundImage: "url('/fondo-login.jpg')",
            filter: "brightness(0.7)",
          }}></div>
        <div className='absolute inset-0 bg-gradient-to-t from-[#212121cc] to-[#2196f380]'></div>
      </div>

      {/* Contenido del login */}
      <div className='relative z-10 min-h-screen flex items-center justify-center p-4'>
        <div className='w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden'>
          {/* Encabezado */}
          <div className='bg-[#2196f3] p-6 text-center'>
            <div className='flex justify-center mb-3'>
              <div className='bg-white p-2 rounded-lg shadow-md'>
                <ShoppingCartIcon className='h-10 w-10 text-[#2196f3]' />
              </div>
            </div>
            <h1 className='text-3xl font-bold text-white'>EFFI</h1>
            <p className='text-white/90 mt-1'>Sistema de Gestión Comercial</p>
          </div>

          {/* Formulario */}
          <div className='p-6 md:p-8'>
            <h2 className='text-2xl font-bold text-[#212121] mb-6 text-center'>Iniciar Sesión</h2>

            <form onSubmit={handleLogin} className='space-y-5'>
              {/* Campo Correo */}
              <div>
                <label htmlFor='correo' className='block text-sm font-medium text-[#212121] mb-1'>
                  Correo electrónico
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <EnvelopeIcon className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    id='correo'
                    type='email'
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className='block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2196f3] focus:border-[#2196f3]'
                    placeholder='usuario@tienda.com'
                    required
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div>
                <label htmlFor='contrasena' className='block text-sm font-medium text-[#212121] mb-1'>
                  Contraseña
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <LockClosedIcon className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    id='contrasena'
                    type='password'
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    className='block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2196f3] focus:border-[#2196f3]'
                    placeholder='••••••••'
                    required
                  />
                </div>
              </div>

              {/* Botón de login */}
              <button
                type='submit'
                disabled={loading}
                className={`w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-md text-white font-medium transition-colors ${
                  loading ? "bg-[#72cf44]/90" : "bg-[#72cf44] hover:bg-[#5cb82e]"
                }`}>
                {loading ? (
                  <>
                    <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    Verificando...
                  </>
                ) : (
                  <>
                    <ArrowRightIcon className='-ml-1 mr-2 h-5 w-5' />
                    Ingresar al sistema
                  </>
                )}
              </button>

              {/* Mensaje de error */}
              {error && (
                <div className='rounded-md bg-red-50 p-3 border border-red-100'>
                  <div className='flex items-start'>
                    <ExclamationTriangleIcon className='h-5 w-5 text-red-400 mt-0.5 flex-shrink-0' />
                    <div className='ml-3'>
                      <h3 className='text-sm font-medium text-red-800'>Error de autenticación</h3>
                      <p className='text-sm text-red-700 mt-1'>{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className='bg-[#ededed] px-6 py-4 border-t border-gray-200'>
            <p className='text-xs text-[#666666] text-center'>
              ¿Necesitas ayuda?{" "}
              <a href='#' className='text-[#2196f3] hover:underline'>
                Contacta al soporte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//   ShoppingCartIcon,
//   LockClosedIcon,
//   EnvelopeIcon,
//   ArrowRightIcon,
//   ExclamationTriangleIcon
// } from "@heroicons/react/24/outline";

// function Login({ setAutenticado, setRol }) {
//   const [correo, setCorreo] = useState("");
//   const [contrasena, setContrasena] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await axios.post("http://localhost:5000/usuarios/ingresar", {
//         correo,
//         contraseña: contrasena,
//       });

//       const { usuario } = res.data;
//       localStorage.setItem("usuario", JSON.stringify(usuario));
//       setAutenticado(true);
//       setRol(usuario.rol);

//       if (usuario.rol === "cliente") {
//         navigate("/cliente");
//       } else if (usuario.rol === "admin") {
//         navigate("/admin");
//       } else if (usuario.rol === "cajero") {
//         navigate("/cajero");
//       } else {
//         navigate("/");
//       }
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.mensaje || "Credenciales inválidas");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex">
//       {/* Panel izquierdo - Formulario */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#f2f2f2]">
//         <div className="w-full max-w-md">
//           {/* Logo y título */}
//           <div className="text-center mb-10">
//             <div className="flex justify-center mb-4">
//               <div className="bg-[#2196f3] p-3 rounded-xl shadow-md">
//                 <ShoppingCartIcon className="h-10 w-10 text-white" />
//               </div>
//             </div>
//             <h1 className="text-4xl font-bold text-[#212121] mb-2">EFFI</h1>
//             <p className="text-[#2196f3] font-medium">Vende más, complícate menos</p>
//           </div>

//           {/* Tarjeta de login */}
//           <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
//             <div className="p-8">
//               <h2 className="text-2xl font-bold text-[#212121] mb-8 text-center">
//                 Iniciar Sesión
//               </h2>

//               <form onSubmit={handleLogin} className="space-y-6">
//                 {/* Campo Correo */}
//                 <div className="space-y-2">
//                   <label htmlFor="correo" className="block text-sm font-medium text-[#212121]">
//                     Correo electrónico
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <EnvelopeIcon className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       id="correo"
//                       type="email"
//                       value={correo}
//                       onChange={(e) => setCorreo(e.target.value)}
//                       className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2196f3] focus:border-[#2196f3]"
//                       placeholder="usuario@tienda.com"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Campo Contraseña */}
//                 <div className="space-y-2">
//                   <label htmlFor="contrasena" className="block text-sm font-medium text-[#212121]">
//                     Contraseña
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <LockClosedIcon className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       id="contrasena"
//                       type="password"
//                       value={contrasena}
//                       onChange={(e) => setContrasena(e.target.value)}
//                       className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2196f3] focus:border-[#2196f3]"
//                       placeholder="••••••••"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Botón de login */}
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#66CC33] ${
//                     loading ? 'bg-[#66CC33]/80' : 'bg-[#66CC33] hover:bg-[#5cb82e]'
//                   }`}
//                 >
//                   {loading ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Verificando...
//                     </>
//                   ) : (
//                     <>
//                       <ArrowRightIcon className="-ml-1 mr-3 h-5 w-5" />
//                       Ingresar al sistema
//                     </>
//                   )}
//                 </button>

//                 {/* Mensaje de error */}
//                 {error && (
//                   <div className="rounded-md bg-red-50 p-4 border border-red-100">
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0">
//                         <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
//                       </div>
//                       <div className="ml-3">
//                         <h3 className="text-sm font-medium text-red-800">Error de autenticación</h3>
//                         <p className="text-sm text-red-700 mt-1">{error}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </form>
//             </div>

//             {/* Pie de tarjeta */}
//             <div className="bg-[#f2f2f2] px-8 py-4 border-t border-gray-200">
//               <p className="text-xs text-[#666666] text-center">
//                 ¿Problemas para ingresar? <a href="#" className="text-[#2196f3] hover:underline">Contacta al soporte</a>
//               </p>
//             </div>
//           </div>

//           {/* Footer legal */}
//           <div className="mt-8 text-center">
//             <p className="text-xs text-[#666666]">
//               © {new Date().getFullYear()} EFFI - Sistema de Gestión Comercial
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Panel derecho - Imagen de fondo */}
//       <div
//         className="hidden lg:block lg:w-1/2 bg-cover bg-center"
//         style={{ backgroundImage: "url('/fondo-login.jpg')" }}
//       ></div>
//     </div>
//   );
// }

// export default Login;
