import os
import asyncio
import json
import logging

import uvloop
import aiopg
import asyncio_redis as redis
import websockets
from websockets.exceptions import ConnectionClosed


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

with open(os.path.join(BASE_DIR, 'config.json')) as f:
    conf = json.loads(f.read())
    CHANNEL = conf['REDIS_MSG_CHANNEL']
    db = conf['DATABASE']
    POSTGRE_CONFIG = 'dbname={} user={} password={} host={}'.format(
        db['NAME'], db['USER'], db['PASSWORD'], db['HOST'])

ENV = os.getenv('ENVIRONMENT', 'development')

if ENV == 'production':
    logging.basicConfig(filename='/var/log/dating/wsserver.log',
                        filemode='w',
                        level=logging.INFO)
    HOST = '0.0.0.0'
else:
    logging.getLogger().setLevel(logging.INFO)
    HOST = 'localhost'


class Application:

    def __init__(self, subscriber, pg_conn):
        self.subscriber = subscriber
        self.pg_conn = pg_conn
        self.connections = {}

    @classmethod
    async def create(cls, subscriber, pg_conn):
        self = Application(subscriber, pg_conn)
        return self

    def get_token(self, path):
        if ENV == 'development':
            return path[1:-1]  # /{token}/
        return path[9:-1]  # /chat_ws/{token}/

    async def ping(self, ws, interval=1):
        while True:
            try:
                await ws.ping()
            except ConnectionClosed:
                await ws.close()
                break
            await asyncio.sleep(interval)

    async def dispatcher(self):
        while True:
            json_msg = (await self.subscriber.next_published()).value
            msg = json.loads(json_msg)
            if 'purpose' in msg:
                await self.notify_read(msg, json_msg)
            else:
                await self.handle_new_message(msg, json_msg)

    async def notify_read(self, msg, json_msg):
        receiver_id = msg['receiver']['id']
        if receiver_id in self.connections:
            conn = self.connections[receiver_id]
            try:
                logging.info('notifying {} about msg read profile={}'.format(
                    conn.remote_address, receiver_id))
                await conn.send(json_msg)
            except ConnectionClosed:
                await conn.close()

    async def handle_new_message(self, msg, json_msg):
        receiver_id = msg['receiver']['id']
        if receiver_id in self.connections:
            connection = self.connections[receiver_id]
            try:
                await self.send_message(connection, json_msg, receiver_id)
            except ConnectionClosed:
                await connection.close()

    async def handler(self, ws, path):
        token = self.get_token(path)  # /chat_ws/{token}/
        is_valid, user_id = await self.is_valid(token)
        if not is_valid:
            logging.info('closed connection to {} due to '
                         'wrong path {}'.format(ws.remote_address, path))
            await ws.close()
            return
        logging.info('opened connection '
                     'to {} on {}'.format(user_id, ws.remote_address))
        self.connections[user_id] = ws
        await self.ping(ws)

    async def send_message(self, ws, msg, user_id=None):
        logging.info('sent message to {},'
                     ' profile={}'.format(ws.remote_address, user_id))
        await ws.send(msg)

    async def is_valid(self, token):
        async with self.pg_conn.acquire() as conn:
            async with conn.cursor() as cur:
                sql = ("select id from dateprofile_dateprofile "
                       "where chat_token='{}';").format(token)
                await cur.execute(sql)
                async for row in cur:
                    user_id = row[0]
                    return True, user_id
                return False, None


async def main():
    redis_conn = await redis.Pool.create(
        host='127.0.0.1', port=6379, poolsize=10)
    subscriber = await redis_conn.start_subscribe()
    await subscriber.subscribe([CHANNEL])
    pg_conn = await aiopg.create_pool(POSTGRE_CONFIG)
    app = await Application.create(subscriber, pg_conn)
    print('serving on {}'.format(HOST))
    await websockets.serve(app.handler, HOST, 8765)
    return app


async def start_listeners(app):
    tasks = map(lambda t: asyncio.ensure_future(t),
                [app.pinger, app.dispatcher])
    await asyncio.wait(tasks)


if __name__ == '__main__':
    loop = uvloop.new_event_loop()
    asyncio.set_event_loop(loop)
    app = loop.run_until_complete(main())
    asyncio.ensure_future(app.dispatcher())
    loop.run_forever()
    loop.close()


