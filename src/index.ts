import http from 'http'

export const server = http.createServer((_: http.IncomingMessage, res: http.ServerResponse) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(
    JSON.stringify({
      data: 'It Works :)!'
    })
  )
})

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000/')
})
