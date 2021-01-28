import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Fragment } from "react";
import { graphql } from '@octokit/graphql';

export default function Home({data}) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />

        <meta name="description" content={data.organization.description} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" key="twcard" />
        <meta name="twitter:creator" content={data.organization.twitterUsername} key="twhandle" />

        {/* Open Graph */}
        <meta property="og:url" content={data.organization.websiteUrl} key="ogurl" />
        <meta property="og:image" content={data.organization.avatarUrl} key="ogimage" />
        <meta property="og:site_name" content={data.organization.name} key="ogsitename" />
        <meta property="og:title" content={data.organization.name} key="ogtitle" />
        <meta property="og:description" content={data.organization.description} key="ogdesc" />

        <title>{data.organization.name}</title>
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
            return <Fragment key={index}>
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
        repositories(first: 30, orderBy: {field: NAME, direction: ASC}) {
          nodes {
            url
            description
            forkCount
            stargazerCount
            openGraphImageUrl
            name
          }
        }
        websiteUrl
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