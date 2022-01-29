import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout, Header } from '../components/shared';

function ChatPage() {
  const username = 'peas';
  const router = useRouter();

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
        <div className="flex flex-col-reverse gap-2 bg-gray-700 p-2 rounded w-[60vh] h-[50vh] justify-between">
          <input type="text" className="w-full h-10" />
        </div>
      </Layout>
    </>
  );
}

export default ChatPage;
