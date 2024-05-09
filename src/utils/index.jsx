import data from "../assets/data/data.json";
class Address {
    getCities() {
        return data.map((item) => item.Name);
    }
    getDistricts(city) {
        const cityData = data.find((item) => item.Name === city);
        return cityData.Districts.map((item) => item.Name);
    }
    getWards(city, district) {
        const cityData = data.find((item) => item.Name === city);
        const districtData = cityData.Districts.find((item) => item.Name === district);
        return districtData.Wards.map((item) => item.Name);
    }
}
export const address = new Address();
