
export const SELECTED_CHAT = 'SELECTED_CHAT'

export function selectChat(ChatSelected){
    //make getResuest to data
    return {
        type: SELECTED_CHAT,
        payload: ChatSelected
    }
}