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
    const districtData = cityData.Districts.find(
      (item) => item.Name === district
    );
    return districtData.Wards.map((item) => item.Name);
  }
}

class Date {
  convertDateToString(dateString) {
    return dateString.split("T")[0].split("-").reverse().join("/");
  }
  convertDateToTime(dateString) {
    //2024-05-23T17:26:46.070Z to mm/hh dd/mm/yyyy
    const date = new Date(dateString);
    return `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  }
}
export const address = new Address();
export const date = new Date();
