import configparser
from dataclasses import dataclass
import os

@dataclass
class Settings:
    '''
    This dataclass to store azure chatgpt configuration.
    '''
    def __init__(self):
        self.config = configparser.ConfigParser()
        self.config.read('hackathoon/settings.ini')
        self.team_api_key = self.config['aixplain']['team_api_key']
        self.AWS_ACCESS_KEY_ID = self.config['AWS']['AWS_ACCESS_KEY_ID']
        self.AWS_SECRET_ACCESS_KEY = self.config['AWS']['AWS_SECRET_ACCESS_KEY']
        self.BUCKET_NAME =self.config['AWS']['BUCKET_NAME']

        os.environ["TEAM_API_KEY"] = self.team_api_key
        os.environ['AWS_ACCESS_KEY_ID'] = self.AWS_ACCESS_KEY_ID
        os.environ['AWS_SECRET_ACCESS_KEY'] = self.AWS_SECRET_ACCESS_KEY
        os.environ['BUCKET_NAME'] = self.BUCKET_NAME