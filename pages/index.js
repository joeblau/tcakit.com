import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Fragment } from "react";
import { graphql } from '@octokit/graphql';

export default function Home({data}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>The Composable Architecture Kit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {data.organization.name}
        </h1>

        <p className={styles.description}>
          {data.organization.description}
        </p>

        <div className={styles.grid}>
          {data.organization.repositories.nodes.map((repo, index) => {
            return <Fragment>
                <a href={repo.url} className={styles.card}>
                <img src={repo.openGraphImageUrl}/>
                <h3>{repo.name}</h3>
                <p>{repo.description}</p>
              </a>
            </Fragment>
          })}
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://github.com/tcakit" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </footer>
    </div>
  )
}

export async function getStaticProps(context) {
  const data = await graphql(
    `
    {
      organization(login: "tcakit") {
        description
        avatarUrl
        name
        twitterUsername
        repositories(first: 20) {
          nodes {
            url
            description
            forkCount
            stargazerCount
            openGraphImageUrl
            name
          }
        }
      }
    }
    `,
    {
      headers: {
        authorization: `token ${process.env.GITHUB_REPO_READ}`,
      },
    }
  );
  return {
    props: {data:data},
    revalidate: 8600,
  }
}