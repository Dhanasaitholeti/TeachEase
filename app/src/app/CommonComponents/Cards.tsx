import React from 'react';
import Link from 'next/link';

interface CardProps {
  id?: string;
  title: string;
  description?: string;
  href?: string;
}

const Card: React.FC<CardProps> = ({ id, title, description = 'N/A', href }) => {
  const cardContent = (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 cursor-pointer">
      <div className="h-48 bg-[#89CFF0] flex items-center justify-center">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <div className="p-4">
        <p className="text-gray-700">{description}</p>
      </div>
    </div>
  );

  return href ? (
    <Link href={href}>
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
};

export default Card;
