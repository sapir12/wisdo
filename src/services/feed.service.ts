import { PipelineStage, Types } from 'mongoose';
import { BookModel } from '../models/book.model';
import { AuthenticatedUser } from '../types/auth';

export async function getFeed(user: AuthenticatedUser) {
  if (user.libraries.length === 0) {
    return [];
  }

  const libraryIds = user.libraries.map((libraryId) => new Types.ObjectId(libraryId));
  const now = new Date();
  const millisInDay = 1000 * 60 * 60 * 24;

  const pipeline: PipelineStage[] = [
    {
      $match: {
        library: { $in: libraryIds },
      },
    },
    {
      $addFields: {
        sameCountryAuthor: {
          $cond: [{ $eq: ['$authorCountry', user.country] }, 1, 0],
        },
        ageInDays: {
          $divide: [{ $subtract: [now, '$publishedDate'] }, millisInDay],
        },
      },
    },
    {
      $setWindowFields: {
        output: {
          maxPages: {
            $max: '$pages',
            window: { documents: ['unbounded', 'unbounded'] },
          },
          maxAgeInDays: {
            $max: '$ageInDays',
            window: { documents: ['unbounded', 'unbounded'] },
          },
        },
      },
    },
    {
      $addFields: {
        normalizedPages: {
          $cond: [{ $gt: ['$maxPages', 0] }, { $divide: ['$pages', '$maxPages'] }, 0],
        },
        normalizedAge: {
          $cond: [{ $gt: ['$maxAgeInDays', 0] }, { $divide: ['$ageInDays', '$maxAgeInDays'] }, 0],
        },
      },
    },
    {
      $addFields: {
        relevanceScore: {
          $add: [
            { $multiply: ['$normalizedPages', 0.8] },
            { $multiply: ['$normalizedAge', 0.2] },
          ],
        },
      },
    },
    {
      $sort: {
        sameCountryAuthor: -1,
        relevanceScore: -1,
        _id: 1,
      },
    },
    {
      $project: {
        title: 1,
        author: 1,
        authorCountry: 1,
        publishedDate: 1,
        pages: 1,
        library: 1,
        relevanceScore: 1,
      },
    },
  ];

  return BookModel.aggregate(pipeline);
}
