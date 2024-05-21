import data from "../assets/data/data.json";
console.log(data);
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
    console.log("Kiểm tra đầu vào: ", typeof dateString);
    console.log(new Date("2024-05-13T05:39:43.712Z"));

   let day = dateString.split("T")[0].split("-").reverse().join("/");
    let time = dateString.split("T")[1].split(":").slice(0, 2).join(":");
    return `${time} ${day}`;
}



}
export const address = new Address();
export const date = new Date();
