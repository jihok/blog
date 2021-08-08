import styles from "../styles/message.module.css";
import utilStyles from "../styles/utils.module.css";
import { DateComponent } from "./date";
import { Greeting } from "./guestbook";
import { CSSProperties } from "react";

interface IMessage {
  greeting: Greeting;
  isNew?: boolean;
}

export const Message = ({ greeting, isNew }: IMessage) => {
  return (
    <div className={styles.container}>
      <div className={styles.message}>
        <h2>{greeting.message}</h2>
        <small className={utilStyles.lightText}>
          {isNew && <span>Thanks for stopping by </span>}
          <a
            href={
              process.env.NODE_ENV === "development"
                ? "#"
                : `https://ropsten.etherscan.io/address/${greeting.author}`
            }
            target='_blank'
          >
            {isNew
              ? greeting.author
              : `${greeting.author.slice(0, 6)}...${greeting.author.slice(-4)}`}
          </a>
          {!isNew && (
            <>
              <span> · </span>
              <DateComponent value={greeting.createdAt} />
            </>
          )}
        </small>
      </div>
    </div>
  );
};

const Placeholder = ({ style }: { style?: CSSProperties }) => (
  <div className={styles.placeholder} style={style} />
);
export const MessagePlaceholder = () => {
  return (
    <div className={styles.container}>
      <div className={styles.message}>
        <Placeholder
          style={{ height: "1.5em", width: "60%", margin: "1.5em 0px" }}
        />
        <div className={styles.greetingMetadataPlaceholder}>
          <Placeholder
            style={{ width: "25%", height: "1em", marginRight: 2 }}
          />
          ·
          <Placeholder style={{ width: "25%", height: "1em", marginLeft: 2 }} />
        </div>
      </div>
    </div>
  );
};
