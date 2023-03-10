import React from "react";
import PropTypes from "prop-types";
import { kebabCase } from "lodash";
import { Helmet } from "react-helmet";
import { graphql, Link } from "gatsby";
import { getImage } from "gatsby-plugin-image";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";
import PreviewCompatibleImage from "../components/PreviewCompatibleImage";
import FullWidthImage from "../components/FullWidthImage";

// eslint-disable-next-line
export const ListPostTemplate = ({
  content,
  contentComponent,
  description,
  featuredimage,
  listitems,
  tags,
  title,
  helmet,
}) => {
  const PostContent = contentComponent || Content;
  const fullWidthImage = getImage(featuredimage) || featuredimage;

  return (
    <div>

    {featuredimage ? (
        <FullWidthImage img={fullWidthImage} title={title} subheading= "Packing List" />
        ) : (<h1  style={{ textAlign: `center` }} class="title is-size-2 has-text-weight-bold is-bold-light">{title}</h1>) } 

    <section className="section">
      {helmet || ""} 
      
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
          
            <p>{description}</p>
            <PostContent content={content} />
            
            <div className="columns is-multiline">
            {listitems &&
              listitems.map((item) => (
                <div className="is-parent column is-6">
                  <article
                    className={`blog-list-item tile is-child box notification`}
                  >
                    <header>
                      <h3>
                      {item.link ? (
                      <Link to={item.link}>{item.itemname}</Link>
                      ) : item.itemname }  
                      </h3>

                    {item.image ? (
                      <div className="featured-thumbnail">
                        <PreviewCompatibleImage
                          imageInfo={{
                            image: item.image,
                            alt: `featured image thumbnail for item ${item.itemname}`,
                          }}
                        />
                      </div>
                      ) : null}  
                    </header>
                    <PostContent content={item.description} />
                    <div dangerouslySetInnerHTML={{ __html: item.html}} />
                  </article>
                </div>
              ))}
          </div>
            
            {tags && tags.length ? (
              <div style={{ marginTop: `4rem` }}>
                <h4>Tags</h4>
                <ul className="taglist">
                  {tags.map((tag) => (
                    <li key={tag + `tag`}>
                      <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

ListPostTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
  featuredimage: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  listitems: PropTypes.shape({
    itemname: PropTypes.string,
    link: PropTypes.string,
    image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    description: PropTypes.object,
  }),
};

const ListPost = ({ data }) => {
  const { markdownRemark: post } = data;

  return (
    <Layout>
      <ListPostTemplate
        content={post.html}
        contentComponent={HTMLContent}
        description={post.frontmatter.description}
        featuredimage={post.frontmatter.featuredimage}
        link={post.frontmatter.link}
        helmet={
          <Helmet titleTemplate="%s | Travel List">
            <title>{`${post.frontmatter.title}`}</title>
            <meta
              name="description"
              content={`${post.frontmatter.description}`}
            />
          </Helmet>
        }
        listitems={post.frontmatter.listitems}
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
      />
    </Layout>
  );
};

ListPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
};

export default ListPost;

export const pageQuery = graphql`
  query ListPostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        description
        featuredimage {
          childImageSharp {
            gatsbyImageData(quality: 100, layout: FULL_WIDTH)
          }
        }
        listitems {
          itemname
          image
          description
          link
        }
        tags
      }
    }
  }
`;
