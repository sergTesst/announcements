
export async function client(endpoint, { body, ...customConfig } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  let data;

  try {
    const response = await window.fetch(endpoint, config)
    data = await response.json()
    if (response.ok) {
      return data
    }
    throw new Error(response.statusText)
  } catch (err) {
    console.error('An error occurred', err)
    return Promise.reject(err.message ? err.message : data)
  }

}

client.get = function (endpoint, customConfig = {}) {

  return client(endpoint, { ...customConfig, method: 'GET' });
}

client.post = function (endpoint, body, customConfig = {}) {
  return client(endpoint, { ...customConfig, body })
}

client.update = function (endpoint, updates){
  return client(endpoint,{
    method:'PUT',
    body:updates
  })
}

client.delete = function (endpoint){
  return client(endpoint,{method:'DELETE'})
}