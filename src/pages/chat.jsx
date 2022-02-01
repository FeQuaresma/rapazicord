import { createClient } from '@supabase/supabase-js';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout, Header } from '../components/shared';
import lTrim from '../components/shared/ltrim';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzY3Mjg4NCwiZXhwIjoxOTU5MjQ4ODg0fQ.5NuwYhSuPgG59F_YYWl17ew_KVnTT6_jd0hh4lgaYkk';
const SUPABASE_URL = 'https://ygkabspwygckxioqmewk.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState();
  const router = useRouter();

  useEffect(() => {
    supabaseClient
      .from('messages')
      .select('*')
      .order('key', { ascending: false })
      .then(({ data }) => {
        console.log('Dados da consulta:', data);
        setMessages(data);
      });
  }, []);

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
                    <img className="h-10 rounded-full" src={`https://github.com/${message.author}.png`} alt="" />
                    <span className="text-lg">{message.author}</span>
                    <span className="text-sm text-gray-400">{message.created_at}</span>
                  </div>
                  <div>
                    <span className="text-xl">{message.content}</span>
                  </div>
                </div>
              ))
            }
          </div>
          <form
            className="flex items-center"
            onSubmit={(e) => {
              e.preventDefault();
              // const date = new Date();

              const newMessage = {
                author: 'FeQuaresma',
                content,
              };

              supabaseClient
                .from('messages')
                .insert([newMessage])
                .then(({ data }) => {
                  console.log('criando mensagem: ', data);
                  setMessages((old) => [
                    data[0],
                    ...old,
                  ]);
                });
              setContent('');
              console.log(messages);
            }}
          >
            <input
              type="text"
              className="w-full h-10 bg-gray-600 text-white p-2 rounded"
              placeholder="Insira sua mensagem aqui..."
              value={content}
              onChange={(e) => {
                setContent(lTrim(e.target.value));
                console.log(e.target.value.length);
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
