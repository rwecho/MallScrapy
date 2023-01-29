import scrapy
from scrapy import Request, Spider


class DuoduoSpider(scrapy.Spider):
    name = 'duoduo'
    allowed_domains = ['mobile.yangkeduo.com']
    start_urls = ['http://mobile.yangkeduo.com/']

    def start_requests(self):
        for url in self.start_urls:
            yield Request(url=url, callback=self.parse, meta={'type': 'duoduo'}, dont_filter=True)

    def parse(self, response):
        pass
