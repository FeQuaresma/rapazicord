import Head from "next/head"
import { useState } from "react"
import { useRouter } from "next/router"

function HomePage() {
  //const username = 'peas'
  const [username, setUsername] = useState('FeQuaresma');
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Rapazicord</title>
      </Head>
      <div className="flex w-auto h-full justify-center items-center">
        <div className="flex bg-gray-900 rounded p-8 gap-4">
          <form
            onSubmit={function (eventInfo) {
              console.log('Alugém submeteu o form')
              eventInfo.preventDefault(); //faz com que pare de regarregar a pagina
              router.push('/chat'); //vai para a pagina chat sem recarregar
              //window.location.href = '/chat';
            }}
            className="flex flex-col justify-center gap-10 p-6">
            <div className="flex flex-col">
              <span className="text-2xl font-semibold text-white text-center">Seja Bem vindo ao Rapazicord</span>
              <span className="text-white text-sm text-center">Mais que amigos, Friends</span>
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                className="p-2"
                value={username}
                onChange={function (event) {
                  console.log('O usuário digitou', event.target.value);
                  //onde ta o valor?
                  const valor = event.target.value;
                  //Trocar o valor da varíavel 
                  // através do React e avise quem precisa
                  setUsername(valor);
                }}
              />
              <button
                type="submit"
                className="bg-teal-800 text-white rounded p-2">
                Entrar</button>
            </div>
          </form>
          <div className="flex flex-col gap-2 bg-gray-700 p-2 rounded">
            <img className="rounded-full max-h-[10rem] max-w-[10rem]" src={`https://github.com/${username}.png`} alt="" />
            <span className="text-white bg-gray-900 p-2 text-center rounded text-sm">{username}</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage
