const CITY_KEY = 'hkzf_city'

const getCity = () => {
    return JSON.parse(localStorage.getItem(CITY_KEY))
}
const setCity = (city) => {
    localStorage.setItem(CITY_KEY, JSON.stringify(city))
}

export { getCity, setCity }