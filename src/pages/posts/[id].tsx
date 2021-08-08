import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { DateComponent } from "../../../components/date";
import { getAllPostIds, getPostData } from "../../../lib/posts";
import utilStyles from "../../../styles/utils.module.css";
import styles from "./posts.module.css";

export default function Post({ postData }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <header className={styles.header}>
        <Link href='/'>
          <a>
            <Image
              priority
              src='/images/profile.jpg'
              className={utilStyles.borderCircle}
              height={108}
              width={108}
              alt='Jiho'
            />
          </a>
        </Link>
      </header>
      <main>
        <article>
          <div className={styles.header}>
            <h1 className={utilStyles.headingXl}>{postData.title}</h1>
            <div className={utilStyles.lightText}>
              <DateComponent value={postData.date} />
            </div>
          </div>
          <hr />
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </article>
      </main>
      <footer>
        <hr />
        <div className={utilStyles.lightText}>
          Got any thoughts to share?{" "}
          <span>
            <Link href='/'>I know just the place.</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params.id as string);
  return {
    props: {
      postData,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};
