const baseURL = 'https://672c3f2a1600dda5a9f7ac39.mockapi.io/QLSP';

export const qlspServices = {
    getListProducts: () => {
        return axios({
            method: 'GET',
            url: baseURL
        });
    },

    getProductByID: (id) => {
        return axios({
            method: 'GET',
            url: `${baseURL}/${id}`
        })
    },

    getProductByName: (name) => {
        return axios({
            method: 'GET',
            url: `${baseURL}?name=${name}`
        })
    },

    addNewProduct: (payload) => {
        return axios({
            method: 'POST',
            url: baseURL,
            data: payload
        })
    },

    upadteProduct: (id, payload) => {
        return axios({
            method: "PUT",
            url: `${baseURL}/${id}`,
            data: payload
        })
    },

    deleteProduct: (id) => {
        return axios({
            method: "DELETE",
            url: `${baseURL}/${id}`
        })
    },
}