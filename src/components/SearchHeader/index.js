import React from "react";

import { Flex } from "antd-mobile";
import classNames from "classnames";

import { withRouter } from "react-router-dom";
import styles from "./index.module.scss";

const SearchHeader = ({ history, cityName, className }) => {
    return (
        <Flex className={classNames(styles.root, { [className]: className })}>
            <Flex className={styles.searchLeft}>
                <div
                    className={styles.location}
                    onClick={() => history.push("/citylist")}
                >
                    <span>{cityName}</span>
                    <i className="iconfont icon-arrow" />
                </div>
                <div
                    className={styles.search}
                    onClick={() => history.push("/search")}
                >
                    <Flex>
                        <i className="iconfont icon-seach" />
                        <span>请输入小区或地址</span>
                    </Flex>
                </div>
            </Flex>
            <i
                className="iconfont icon-map"
                onClick={() => history.push("/map")}
            />
        </Flex>
    );
};

export default withRouter(SearchHeader);
