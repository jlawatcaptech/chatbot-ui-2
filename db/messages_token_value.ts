import { supabase } from "@/lib/supabase/browser-client"

export const upsertMessageTokenValue = async (
  chat_id: string,
  token_value: number
) => {
  try {
    // Check if the record exists
    const { data: existingData, error: fetchError } = await supabase
      .from("messages_token_value")
      .select("*")
      .eq("chat_id", chat_id)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      throw new Error(fetchError.message) // Handle other errors
    }

    if (existingData) {
      // If the record exists, calculate the new token value
      const newTokenValue = (existingData.token_value || 0) + token_value

      // Update the existing record with the new token value
      const { data, error: updateError } = await supabase
        .from("messages_token_value")
        .update({ token_value: newTokenValue })
        .eq("chat_id", chat_id)
        .select("*")
        .single()

      if (updateError) {
        throw new Error(updateError.message)
      }

      //console.log(`Update Success: ${JSON.stringify(data)}`);
      return data // Return the updated record
    } else {
      // If the record does not exist, insert it
      const { data, error: insertError } = await supabase
        .from("messages_token_value")
        .insert([{ chat_id, token_value }])
        .select("*")
        .single()

      if (insertError) {
        throw new Error(insertError.message)
      }

      //console.log(`Insert Success: ${JSON.stringify(data)}`);
      return data // Return the inserted record
    }
  } catch (error) {
    throw error
  }
}
