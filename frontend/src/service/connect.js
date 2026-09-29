import axios from "axios";

const baseUrl = "http://localhost:3001/persons"

const getAll = () => axios.get(baseUrl).then(res => res.data)

const createPerson = (newPerson) => axios.post(baseUrl, newPerson).then(res => res.data)

const deletePerson = (person) => {
    const isSure = window.confirm(`are you sure to delete ${person.name} ?`)
    if (isSure) return axios.delete(`${baseUrl}/${person.id}`)
    else throw new Error("delete canceled")
}

const replacePerson = (person) => {
    return axios.put(`${baseUrl}/${person.id}`, person).then(res => res.data)
}

export default {
    getAll,
    createPerson,
    deletePerson,
    replacePerson
}