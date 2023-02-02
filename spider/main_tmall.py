from shangcheng.spiders.jd import JdSpider
from shangcheng.spiders.duoduo import DuoduoSpider
from shangcheng.spiders.tmall import TmallSpider
from scrapy.utils.project import get_project_settings
from scrapy.crawler import CrawlerRunner
from twisted.internet import reactor
import os
from scrapy.utils.log import configure_logging


def crawl_job():
    """
    Job to start spiders.
    Return Deferred, which will execute after crawl has completed.
    """
    settings_file_path = 'shangcheng.settings'
    os.environ.setdefault('SCRAPY_SETTINGS_MODULE', settings_file_path)
    configure_logging({'LOG_FORMAT': '%(levelname)s: %(message)s'})

    settings = get_project_settings()
    runner = CrawlerRunner(settings)
    return runner.crawl(TmallSpider)


def schedule_next_crawl(null, sleep_time):
    """
    Schedule the next crawl
    """
    reactor.callLater(sleep_time, crawl)


def crawl():
    """
    A "recursive" function that schedules a crawl 30 seconds after
    each successful crawl.
    """
    # crawl_job() returns a Deferred
    d = crawl_job()
    # call schedule_next_crawl(<scrapy response>, n) after crawl job is complete
    d.addCallback(schedule_next_crawl, 60)  # unit: second
    d.addErrback(catch_error)


def catch_error(failure):
    print(failure.value)


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    crawl()
    reactor.run()
