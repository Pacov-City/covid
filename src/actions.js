export const SET_DATA='SET_DATA'
export const SELECT_ORP='SELECT_ORP'
export const SET_ERROR='SET_ERROR'

export function setData(data){
    return {
        type: SET_DATA,
        data: data
    }
}

export function selectOrp(orpId){
    return {
        type: SELECT_ORP,
        data: orpId
    }
}

export function setError(error){
    return {
        type: SET_ERROR,
        error: error,
    }
}


