import { customAlphabet } from 'nanoid';
import supabase from '../config/supabase';

async function getFreeId(table: string, alphabet = '1234567890', size = 8) {
  const nanoid = customAlphabet(alphabet, size);
  let id = nanoid();

  while (true) {
    const { data } = await supabase
      .from(table)
      .select()
      .eq('key', id);
    if (data?.length === 0) {
      break;
    }
    id = nanoid();
  }

  return id;
}

export default getFreeId;
