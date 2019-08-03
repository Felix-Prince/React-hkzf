import React from "react";

import classNames from "classnames";
import styles from "./index.module.scss";

const HouseItem = ({ houseImg, title, desc, tags, price, style, onClick }) => {
    return (
        <div className={styles.house} style={style} onClick={onClick}>
            <div className={styles.imgWrap}>
                <img className={styles.img} src={houseImg} alt="" />
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <div className={styles.desc}>{desc}</div>
                <div>
                    {tags.map((tag, index) => {
                        let tagClass = `tag${((Math.random() * 3) | 0) + 1}`;
                        return (
                            <span
                                className={classNames(
                                    styles.tag,
                                    styles[tagClass]
                                )}
                                key={index}
                            >
                                {tag}
                            </span>
                        );
                    })}
                </div>
                <div className={styles.price}>
                    <span className={styles.priceNum}>{price}</span> 元/月
                </div>
            </div>
        </div>
    );
};

export default HouseItem;
