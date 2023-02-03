# Define here the models for your spider middleware
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/spider-middleware.html

from scrapy import signals
import time

# useful for handling different item types with a single interface
from itemadapter import is_item, ItemAdapter
from scrapy.http import HtmlResponse
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
from selenium import webdriver
from faker import Faker
import os


class ShangchengSpiderMiddleware:
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the spider middleware does not modify the
    # passed objects.

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_spider_input(self, response, spider):
        # Called for each response that goes through the spider
        # middleware and into the spider.

        # Should return None or raise an exception.
        return None

    def process_spider_output(self, response, result, spider):
        # Called with the results returned from the Spider, after
        # it has processed the response.

        # Must return an iterable of Request, or item objects.
        for i in result:
            yield i

    def process_spider_exception(self, response, exception, spider):
        # Called when a spider or process_spider_input() method
        # (from other spider middleware) raises an exception.

        # Should return either None or an iterable of Request or item objects.
        pass

    def process_start_requests(self, start_requests, spider):
        # Called with the start requests of the spider, and works
        # similarly to the process_spider_output() method, except
        # that it doesn’t have a response associated.

        # Must return only requests (not items).
        for r in start_requests:
            yield r

    def spider_opened(self, spider):
        spider.logger.info('Spider opened: %s' % spider.name)


class ShangchengDownloaderMiddleware:
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the downloader middleware does not modify the
    # passed objects.
    def __init__(self) -> None:
        self.timeout = 60

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_request(self, request, spider):
        # Called for each request that goes through the downloader
        # middleware.

        _type = spider.mall_type

        self.browser.get(request.url)

        for i in range(3):
            self.browser.execute_script(
                'window.scrollTo(0,document.body.scrollHeight)')

            time.sleep(1)  # 等待所有元素加载完成

        # 等待加载完所有的商品list 然后进一步解析

        if _type == "tmall":
            self.wait.until(EC.presence_of_element_located(
                (By.XPATH, './/div[@class="grid g-clearfix"]')))
        elif _type == "jd":
            self.wait.until(EC.presence_of_element_located(
                (By.XPATH, './/ul[@class="gl-warp clearfix"]/li')))
        elif _type == "duoduo":
            self.wait.until(EC.presence_of_element_located(
                (By.XPATH, './/div[@class="_3glhOBhU"]')))
        else:
            raise NotImplementedError(f"Unknow type {_type}")

        return HtmlResponse(url=request.url, body=self.browser.page_source, request=request, encoding='utf-8', status=200)

    def process_response(self, request, response, spider):
        # Called with the response returned from the downloader.

        # Must either;
        # - return a Response object
        # - return a Request object
        # - or raise IgnoreRequest
        return response

    def process_exception(self, request, exception, spider):
        # Called when a download handler or a process_request()
        # (from other downloader middleware) raises an exception.

        # Must either:
        # - return None: continue processing this exception
        # - return a Response object: stops process_exception() chain
        # - return a Request object: stops process_exception() chain
        pass

    def spider_opened(self, spider):
        options = webdriver.ChromeOptions()
        dir_path = os.getcwd()
        options.add_argument(f"user-data-dir={dir_path}/selenium")
        # 设置中文
        # options.add_argument('lang=zh_CN.UTF-8')
        # 设置无图加载，提高速度
        # prefs = {"profile.managed_default_content_settings.images": 2}
        # options.add_experimental_option("prefs", prefs)
        # 设置无头浏览器
        # options.add_argument('--headless')

        # this is to fixed multiple running spiders
        # https://stackoverflow.com/questions/56637973/how-to-fix-selenium-devtoolsactiveport-file-doesnt-exist-exception-in-python
        # options.add_argument("--remote-debugging-port=9221")

        self.browser = webdriver.Chrome(chrome_options=options)
        self.wait = WebDriverWait(self.browser, self.timeout)

        spider.browser = self.browser
        spider.logger.info('Spider opened: %s' % spider.name)


class ShangchengDownloadmiddlewareRandomUseragent:
    def __init__(self) -> None:
        self.faker = Faker()

    def process_request(self, request, spider):
        user_agent = self.faker.user_agent()
        print(f"UserAgent: {user_agent}")
        request.headers.setdefault('User-Agent', user_agent)
