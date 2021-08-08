import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Message, MessagePlaceholder } from "./message";
import GuestbookContract from "../src/artifacts/contracts/Guestbook.sol/Guestbook.json";
import styles from "../styles/guestbook.module.css";
import utilStyles from "../styles/utils.module.css";

declare global {
  interface Window {
    ethereum: any;
  }
}

export interface Greeting {
  author: string;
  message: string;
  createdAt: number;
}

type WalletError = "NO_WALLET" | "NOT_ROPSTEN";
type TransactionError = "TXN_FAILED";

const requestAccount = async () => {
  await window.ethereum.request({ method: "eth_requestAccounts" });
};

const getWalletError = (): WalletError | null => {
  if (window.ethereum) {
    if (process.env.NODE_ENV === "development") {
      return null;
    } else if (window.ethereum.chainId === "0x3") {
      return null;
    }
    return "NOT_ROPSTEN";
  }
  return "NO_WALLET";
};

export default function Guestbook() {
  const [message, setMessage] = useState("");
  const [guestbook, setGuestbook] = useState<Greeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPendingTx, setHasPendingTx] = useState(false);
  const [newMessages, setNewMessages] = useState<Greeting[]>([]);
  const [error, setError] =
    useState<WalletError | TransactionError | undefined>();

  useEffect(() => {
    const fetchGreetings = async () => {
      const walletError = getWalletError();
      if (!walletError) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_GUESTBOOK_ADDRESS,
          GuestbookContract.abi,
          provider
        );

        try {
          const data: any[] = await contract.getGreetings();
          setGuestbook(
            data
              .map(
                ([author, message, createdAt]) =>
                  ({
                    author,
                    message,
                    createdAt: createdAt.toNumber(),
                  } as Greeting)
              )
              .sort((a, b) => b.createdAt - a.createdAt)
          );
          setIsLoading(false);
        } catch (err) {
          setError("TXN_FAILED");
          console.error(err);
        }
      } else {
        setError(walletError);
      }
    };
    fetchGreetings();
  }, []);

  const submitMessage = async () => {
    if (!message) return;

    const walletError = getWalletError();
    if (!walletError) {
      try {
        setError(undefined);
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_GUESTBOOK_ADDRESS,
          GuestbookContract.abi,
          signer
        );
        const transaction = await contract.addGreeting(message);
        setHasPendingTx(true);
        await transaction.wait();

        setNewMessages(
          [
            ...newMessages,
            {
              author: transaction.from,
              createdAt: Math.floor(new Date().getTime() / 1000),
              message,
            } as Greeting,
          ].sort((a, b) => b.createdAt - a.createdAt)
        );
        setHasPendingTx(false);
        setMessage("");
      } catch (err) {
        setError("TXN_FAILED");
        console.error(err);
      }
    } else {
      setError(walletError);
    }
  };

  return (
    <>
      <h5 className={styles.title}>
        SIGN MY GUΞSTBOOK{" "}
        <span style={{ fontSize: "0.75em" }}>
          <a
            href='https://ropsten.etherscan.io/address/0x30517bc1954ee23451a9df0ed142e69dc7c8f769'
            target='_blank'
          >
            🔗
          </a>
        </span>
      </h5>
      <div className={styles.container}>
        <textarea
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Say hello... forever'
          value={message}
        />
        <span className={styles.buttonRow}>
          <button type='button' onClick={submitMessage}>
            <h5>SUBMIT</h5>
          </button>
          {error && getErrorMessage(error)}
        </span>
      </div>
      {isLoading ? (
        <>
          <MessagePlaceholder />
          <MessagePlaceholder />
          <MessagePlaceholder />
        </>
      ) : (
        renderMessages(newMessages, guestbook, hasPendingTx)
      )}
    </>
  );
}

const getErrorMessage = (error: WalletError | TransactionError) => {
  let errorMsg: string;
  switch (error) {
    case "NO_WALLET":
      errorMsg = "Install MetaMask to leave a message.";
      break;
    case "NOT_ROPSTEN":
      errorMsg = "Connect to Ropsten.";
      break;
    case "TXN_FAILED":
      errorMsg = "Your submission failed to post.";
      break;
    default:
      return null;
  }
  return (
    <span className={utilStyles.lightText}>
      <span className={`${styles.errorIcon} ${utilStyles.marginRightSm}`}>
        ❌
      </span>
      {errorMsg}
    </span>
  );
};

/**
 *
 * @param newMessages a JS object representation of the message to be added to the Guestbook contract to avoid
 * a full loading state and another read from the blockchain
 * @param guestbook the existing messages that were already pulled
 * @param hasPendingTx if true, the newMessages will appear as a placeholder until the transaction completes
 *
 * At some point this should handle pagination, especially if we want to send/retrieve more metadata on each post,
 * to be mindful of gas costs.
 */
const renderMessages = (
  newMessages: Greeting[],
  guestbook: Greeting[],
  hasPendingTx: boolean
) => {
  if (!guestbook.length && !newMessages.length) {
    return (
      <h2 className={`${utilStyles.lightText} ${styles.empty}`}>
        No messages have been left yet.
        <br /> Anything on your mind, anon?
      </h2>
    );
  }

  const prependedMessages = newMessages.map((item) =>
    hasPendingTx ? (
      <MessagePlaceholder />
    ) : (
      <Message key={`${item.createdAt}`} greeting={item} isNew />
    )
  );
  const existingMessages = [...guestbook].map((item) => (
    <Message key={`${item.createdAt}`} greeting={item} />
  ));

  return (
    <>
      {prependedMessages}
      {existingMessages}
    </>
  );
};
