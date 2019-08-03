import axios from "axios";

import { getCity, setCity } from "./city";

const BMap = window.BMap;

/**
 * 获取当前定位的城市信息
 * 1. 从localStorage中获取数据，如果已经存了当前城市信息则获取
 * 2. 如果没有存，则重新获取
 */
const getCurrentCity = () => {
    const curCity = getCity();

    if (!curCity) {
        // 本地没有当前城市信息
        // 因为下面的数据都是异步的，无法直接通过return把内部获取到的数据返回出来，因此这里需要用到promise
        return new Promise(resolve => {
            try {
                const myCity = new BMap.LocalCity();
                myCity.get(async result => {
                    // 根据当前定位的城市名称获取对应的城市信息
                    let res = await axios.get(
                        "http://localhost:8080/area/info",
                        {
                            params: {
                                name: result.name
                            }
                        }
                    );
                    resolve(res.data.body);

                    setCity(res.data.body);
                });
            } catch (e) {
                // 获取失败，返回默认城市信息
                resolve({ label: "上海", value: "AREA|dbf46d32-7e76-1196" });
            }
        });
    } else {
        // 本地有
        // 保持数据格式的一致性
        return Promise.resolve(curCity);
    }
};
export { getCurrentCity, getCity, setCity };

export { API } from "./api";
export { BASE_URL } from "./url";
