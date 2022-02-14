import Head from 'next/head';
import { useState, useEffect, SyntheticEvent, useCallback } from 'react';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';
import { Layout, Header, lTrim } from '../components/shared';
import supabase from '../config/supabase';
import getFreeId from '../lib/db';

interface IMessage {
  key: number,
  author: string,
  content: string,
  created_at: string,
}

function ChatPage() {
  const [messages, setMessages] = useState<Array<IMessage>>([]);
  const [content, setContent] = useState<string>();
  const router = useRouter();
  const [user, setUser] = useState<string>(router.query?.username?.toString());

  function listenNewMessages(addNewMessage: (msg: IMessage) => void) {
    return supabase
      .from('messages')
      .on('INSERT', (liveListen) => {
        addNewMessage(liveListen.new);
      })
      .subscribe();
  }

  const handleNewMessages = useCallback(async (mensagem?: IMessage, contentNewMessage?: string) => {
    if (mensagem !== undefined) {
      if (user !== mensagem.author) {
        setMessages((old) => [
          mensagem,
          ...old,
        ]);
      }
      return;
    }

    /* const date = DateTime.now().setZone('America/Sao_Paulo').toFormat('yyyy-MM-dd'); */
    const date = DateTime.now().setZone('America/Sao_Paulo').toISO();
    const keyGen = await getFreeId('messages');
    const newMessage = {
      key: Number(keyGen),
      author: user,
      content: contentNewMessage,
      created_at: date,
    };
    setMessages((old) => [
      newMessage,
      ...old,
    ]);

    supabase
      .from('messages')
      .insert([newMessage])
      .then(() => {
        console.log();
      }, (e) => console.log(e));
    /* Qual é a necessidade do .then()?
     .then(({ data }) => {
      console.log(data);
    }, (e) => console.log(e)); */
  }, [user]);
  useEffect(() => {
    if (router.query?.username) {
      supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setMessages(data);
        });
      listenNewMessages((liveMessage: IMessage) => {
        if (liveMessage.author !== router.query.username) {
          handleNewMessages(liveMessage);
        }
      });
      setUser(router.query?.username?.toString());
    }
  }, [router.query?.username, handleNewMessages]);

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
          <div className="flex flex-col-reverse gap-5 overflow-y-scroll break-words">
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
                    <span className="text-sm text-gray-400">{DateTime.fromISO(message.created_at).toFormat('dd/MM/yyyy hh:mm')}</span>
                  </div>
                  <div>
                    <span>{message.content}</span>
                  </div>
                </div>
              ))
            }
          </div>
          <form
            className="flex items-center"
            onSubmit={(e) => {
              e.preventDefault();
              handleNewMessages(undefined, content);
              setContent('');
            }}
          >
            <input
              type="text"
              className="w-full h-10 bg-gray-600 text-white p-2 rounded"
              placeholder="Insira sua mensagem aqui..."
              value={content}
              onChange={(e) => {
                setContent(lTrim(e.target.value));
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
