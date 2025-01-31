export async function fetchAggregatedData({
  model,
  matchConditions = {},
  unwindFields = [],
  groupBy = null,
  projectFields = null,
}) {
  let pipeline = [];

  if (Object.keys(matchConditions).length) {
    pipeline.push({ $match: matchConditions });
  }

  unwindFields.forEach((field) => {
    pipeline.push({ $unwind: `$${field}` });
  });

  if (groupBy) {
    pipeline.push({ $group: groupBy });
  }

  if (projectFields) {
    pipeline.push({ $project: projectFields });
  }

  return await model.aggregate(pipeline);
}
