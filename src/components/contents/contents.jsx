import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Content() {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const token = localStorage.getItem('token');
        const result = await axios.get('http://localhost:3003/api/content', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContents(result.data);
      } catch (error) {
        console.error('Error fetching contents', error);
      }
    };

    fetchContents();
  }, []);

  return (
    <div>
      <h2>Contents</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Body</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>
          {contents.map((content) => (
            <tr key={content._id}>
              <td>{content.title}</td>
              <td>{content.body}</td>
              <td>{content.author}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Content;
