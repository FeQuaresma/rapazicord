import { createClient } from '@supabase/supabase-js';
import Head from 'next/head';
import { useState, useEffect, SyntheticEvent } from 'react';
import { useRouter } from 'next/router';
import { Layout, Header, lTrim } from '../components/shared';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzY3Mjg4NCwiZXhwIjoxOTU5MjQ4ODg0fQ.5NuwYhSuPgG59F_YYWl17ew_KVnTT6_jd0hh4lgaYkk';
const SUPABASE_URL = 'https://ygkabspwygckxioqmewk.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface IMessage {
  key: number,
  author: string,
  content: string,
  created_at: string,
};

function ChatPage() {
  const [messages, setMessages] = useState<Array<IMessage>>([]);
  const [content, setContent] = useState<string>();
  const router = useRouter();
  const [user, setUser] = useState<string>(router.query?.username.toString());
  // const [userLogged, setUserLogged] = useState(router.query.username);
  // const userLogged = router.query.username;

  function listenNewMessages(addNewMessage: Function) {
    return supabaseClient
      .from('messages')
      .on('INSERT', (liveListen) => {
        addNewMessage(liveListen.new);
      })
      .subscribe();
  }

  function handleNewMessages(mensagem?: IMessage) {
    if (mensagem !== undefined) {
      // console.log(userLogged, mensagem.author);
      if (user !== mensagem.author) {
        setMessages((old) => [
          mensagem,
          ...old,
        ]);
      }
      console.log({ mensagem });
      console.log('userLogged ', user);
      console.log('mensagem.author ', mensagem.author);
      return;
    }

    const date = '2022-02-04';
    const newMessage = {
      key: messages[0].key + 1,
      author: user,
      content,
      created_at: date,
    };
    setContent('');
    setMessages((old) => [
      newMessage,
      ...old,
    ]);

    supabaseClient
      .from('messages')
      .insert([newMessage])
      .then(({ data }) => {
        console.log('criando mensagem: ', data);
        // console.log(data);
      }, (e) => console.log(e)
      )
    // console.log(messages);
  }
  // estou perdendo o valor da variável no useEffect
  useEffect(() => {
    supabaseClient
      .from('messages')
      .select('*')
      .order('key', { ascending: false })
      .then(({ data }) => {
        // console.log('Dados da consulta:', data);
        setMessages(data);
      });
    listenNewMessages((liveMessage: IMessage) => {
      console.log('liveMessage.author', liveMessage.author);
      console.log('userLogged', user);
      if (liveMessage.author !== user) {
        handleNewMessages(liveMessage);
      }
    });
    if (router.query?.username) {
      setUser(router.query?.username.toString());
    }
    console.log('router.query?.username ', router.query?.username);
  }, [router.query?.username]);

  // [X] Limpar velue com enter
  // [ ] quebrar linhas para mensagens longas
  // [X] botão enviar para mobile

  return (
    <>
      <Head>
        <title>Rapazicord/Chat</title>
      </Head>
      <Layout divProp="flex-col">
        <Header
          title="Chat"
          onClick={() => router.push('/')}
          bTitle="Logout"
        />
        <div className="flex flex-col gap-5 bg-gray-700 p-7 rounded w-[60vh] h-[50vh] justify-end">
          <div className="flex flex-col-reverse gap-5 overflow-y-scroll">
            {
              messages.map((message) => (
                <div key={message.key} className="flex flex-col hover:bg-gray-800 text-white rounded p-4 gap-3">
                  <div className="flex items-end gap-2">
                    <img
                      className="h-10 rounded-full"
                      src={`https://github.com/${message.author}.png`}
                      alt=""
                      onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://github.com/github.png';
                      }}
                    />
                    <span className="text-lg">{message.author}</span>
                    <span className="text-sm text-gray-400">{message.created_at}</span>
                  </div>
                  <div>
                    <span className="text-xs-">{message.content}</span>
                  </div>
                </div>
              ))
            }
          </div>
          <form
            className="flex items-center"
            onSubmit={(e) => {
              e.preventDefault();
              handleNewMessages();
            }}
          >
            <input
              type="text"
              className="w-full h-10 bg-gray-600 text-white p-2 rounded"
              placeholder="Insira sua mensagem aqui..."
              value={content}
              onChange={(e) => {
                setContent(lTrim(e.target.value));
                // console.log(e.target.value.length);
              }}
            />
            <button
              type="submit"
              disabled={content === ''}
            >
              <img className="h-12 w-12" src="https://img.icons8.com/material-rounded/48/ffffff/right-squared.png" alt="" />
            </button>
          </form>
        </div>

      </Layout>
    </>
  );
}

export default ChatPage;
