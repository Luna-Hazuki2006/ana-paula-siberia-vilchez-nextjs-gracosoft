'use client';

import { useEffect, useState } from 'react';
import { IArticle } from '@/types/article';
import { IComment } from '@/types/comment';
import Comment from '@components/comment';
import CommentForm from '@components/commentForm';

interface ArticlePageProps {
  params: { id: string };
}

export default function Article({ params }: ArticlePageProps) {
  const { id } = params;
  const [article, setArticle] = useState<IArticle | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const resArticle = await fetch(`/api/articles/${id}`);
      const dataArticle = await resArticle.json();
      setArticle(dataArticle.data);

      const resComments = await fetch(`/api/comments?articleId=${id}`);
      const dataComments = await resComments.json();
      setComments(dataComments.data);

      setLoading(false);
    };

    fetchData();
  }, [id]);


  const handleNewComment = (newComment: IComment) => {
    setComments((oldComments) => [newComment, ...oldComments]);
  };

  if (loading) return <p>Cargando...</p>;
  if (!article) return <div>Artículo no encontrado.</div>;

  return (
    <div>
      <h1>{article.title}</h1>
      <p>Fuente: {article.source} | Categoría: {article.category}</p>
      <p>{article.content}</p>
      <p>Publicado por: {article.namePublisher}</p>

      <br/>

      <h2>Comentarios</h2>
      <CommentForm articleId={id} onNewComment={handleNewComment}/>

      {comments.length > 0 ? (
        comments.map(comment => <Comment key={comment._id} comment={comment} />)
      ) : (
        <p>No hay comentarios.</p>
      )}
    </div>
  );
}