import Head from 'next/head';
import { ReactEventHandler, SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../components/shared';

function HomePage() {
  // const username = 'peas'
  const [username, setUsername] = useState('');
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Rapazicord</title>
      </Head>
      <Layout divProp="flex-col md:flex-row">
        <form
          onSubmit={(e) => {
            console.log('Alguém submeteu o form');
            e.preventDefault(); // faz com que pare de regarregar a pagina
            router.push(`/chat?username=${username}`); // vai para a pagina chat sem recarregar
            // window.location.href = '/chat';
          }}
          className="flex flex-col justify-center gap-10 p-6"
        >
          <div className="flex flex-col">
            <span className="text-2xl font-semibold text-white text-center">Seja Bem vindo ao Rapazicord</span>
            <span className="text-white text-sm text-center">Mais que amigos, Friends</span>
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              className="p-2 bg-white rounded"
              value={username}
              placeholder="Entre com seu GitHub..."
              onChange={(e) => {
                console.log('O usuário digitou', e.target.value);
                // onde ta o valor?
                const valor = e.target.value;
                // Trocar o valor da varíavel
                // através do React e avise quem precisa
                setUsername(valor.trim());
              }}
            />
            <button
              type="submit"
              className="bg-teal-800 hover:bg-teal-600 text-white rounded p-2"
              disabled={username === ''}
            >
              Entrar
            </button>
            
          </div>
        </form>
        <div className="flex flex-col gap-2 bg-gray-700 p-2 rounded items-center">
          <img
            className="rounded-full max-h-[10rem] max-w-[10rem]"
            alt=""
            src={`https://github.com/${username}.png`}
            onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://github.com/github.png';
            }}
          />
          <span className="text-white bg-gray-900 p-2 text-center rounded text-sm">{username}</span>
        </div>
      </Layout>
    </>
  );
}

export default HomePage;
