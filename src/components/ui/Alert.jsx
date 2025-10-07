export default function Alert({
  message,
  bgColor,
  textColor,
  imageSrc,
  showSpinner = false,
}) {
  return (
    <div
      className={`relative flex ${bgColor} p-2 text-center ${textColor} items-center justify-center mt-[1em] shadow rounded-lg`}
    >
      {/* Imagen posicionada arriba a la izquierda */}
      {!showSpinner && imageSrc && (
        <img
          src={imageSrc}
          alt=''
          className='absolute top-1 left-1 w-[1em] h-[1em]'
        />
      )}

      <h1 className='mx-[1em] flex items-center gap-2'>
        {message}
        {showSpinner && (
          <span className='w-5 h-5 border-4 border-blue-950 border-t-transparent border-solid rounded-full animate-spin'></span>
        )}
      </h1>
    </div>
  );
}
