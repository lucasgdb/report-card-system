import PasswordChanged from './components/PasswordChanged';

const dotsThingsImageClassName =
  'absolute top-1/2 left-1/2 max-w-[calc(100%-64px)] -translate-x-1/2 -translate-y-1/2 max-[699px]:hidden';

export default function PasswordChangedPage() {
  return (
    <>
      <title>Senha redefinida | Usefaz Admin</title>
      <div className="grid min-h-dvh place-items-center bg-[#0020a2] px-4 pt-4">
        <img className={dotsThingsImageClassName} src="/assets/images/dots.svg" alt="" width={964} height={564} />
        <img className={dotsThingsImageClassName} src="/assets/images/things.svg" alt="" width={800} height={546} />

        <PasswordChanged />

        <img
          className="absolute top-0 right-0 h-auto max-w-[80%]"
          src="/assets/images/z_logo.svg"
          alt=""
          width={587}
          height={572}
        />
      </div>
    </>
  );
}
