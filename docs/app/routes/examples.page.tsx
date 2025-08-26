import React from 'react'
import Layout from '../components/RootLayout'

export default function Examples() {
  return (
    <Layout>
      <h1>Examples</h1>
      <p>
        Explore these example applications built with Apex to see how different 
        features work in practice.
      </p>
      
      <h2>Starter Templates</h2>
      <ul>
        <li><a href="https://github.com/Nom-nom-hub/Apex/tree/master/examples/hello-apex">Hello Apex</a> - Basic starter template</li>
        <li><a href="https://github.com/Nom-nom-hub/Apex/tree/master/examples/blog">Blog</a> - Simple blog application</li>
        <li><a href="https://github.com/Nom-nom-hub/Apex/tree/master/examples/ecommerce-starter">E-commerce</a> - E-commerce starter template</li>
        <li><a href="https://github.com/Nom-nom-hub/Apex/tree/master/examples/saas-starter">SaaS</a> - SaaS application starter</li>
      </ul>
      
      <h2>Advanced Examples</h2>
      <ul>
        <li><a href="https://github.com/Nom-nom-hub/Apex/tree/master/examples/docs">Documentation Site</a> - This documentation site</li>
      </ul>
      
      <h2>Community Examples</h2>
      <p>
        Check out the <a href="https://github.com/Nom-nom-hub/Apex/discussions/categories/show-and-tell">Show and Tell</a> section 
        in our GitHub Discussions to see projects built by the community.
      </p>
    </Layout>
  )
}