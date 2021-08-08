import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { DateComponent } from "../../components/date";
import Guestbook from "../../components/guestbook";
import { getSortedPostsData } from "../../lib/posts";
import utilStyles from "../../styles/utils.module.css";
import styles from "../../styles/home.module.css";

export const SITE_TITLE = "Ultrasound Blogging | Jiho";

export default function Home({ allPostsData }) {
  return (
    <div>
      <Head>
        <link rel='icon' href='/favicon.jpg' />
        <meta name='description' content='Learn about Jiho' />
        <meta
          property='og:image'
          content={`https://og-image.vercel.app/${encodeURI(SITE_TITLE)}.png`}
        />
        <meta name='og:title' content={SITE_TITLE} />
        <meta name='twitter:card' content='summary_large_image' />
        <title>{SITE_TITLE}</title>
      </Head>
      <div className={styles.content}>
        <section className={styles.leftSide}>
          <Image
            priority
            src='/images/profile.jpg'
            className={utilStyles.borderCircle}
            height={180}
            width={180}
            alt='Jiho'
          />
          <h1 className={utilStyles.heading2Xl}>Hi, I'm Jiho.</h1>
          <div className={`${styles.blurb} ${utilStyles.lightText}`}>
            I'm a senior full-stack software engineer at a healthtech startup.
            To the right is my guestbook! Your message--along with your public
            address--will be committed to the eternal memory of Ethereum, so
            Metamask is required. Currently only available on Ropsten.
          </div>
          <div className={`${styles.posts} ${utilStyles.lightText}`}>
            I also write things sometimes.
          </div>
          <ul className={styles.list}>
            {allPostsData.map(({ id, date, title }) => (
              <li className={styles.listItem} key={id}>
                <Link href={`/posts/${id}`}>
                  <a>{title}</a>
                </Link>
                <br />
                <small className={utilStyles.lightText}>
                  <DateComponent value={date} />
                </small>
              </li>
            ))}
          </ul>
          <Link href='https://github.com/jihok'>
            <a>
              <Image
                priority
                src='/images/github.png'
                className={utilStyles.borderCircle}
                height={32}
                width={32}
                alt='Github'
              />
            </a>
          </Link>
        </section>
        <section className={styles.guestbook}>
          <Guestbook />
        </section>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};
