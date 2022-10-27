from __future__ import print_function
from xml.etree.ElementTree import tostring
from flask import Flask, render_template, request, Response
from flask_bootstrap import Bootstrap4
import sys
import pandas as pd
import csv
import pygal
from gensim.models.word2vec import Word2Vec


app = Flask(__name__)

bootstrap = Bootstrap4(app)

@app.route('/compare', methods=['POST', 'GET'])
def compare():
  if(request.method == 'POST'):
    first_option = request.form['options_1']
    second_option = request.form['options_2']

    images_1 = []
    
    if(first_option == 'Labour'):
      images_1.append('/static/labour_all.png')
      images_1.append('/static/labour_bar.png')
      first_txt='Labour'
    elif(first_option == 'National'):
      images_1.append('/static/national_all.png')
      first_txt='National'

    if(second_option == 'Labour'):
      second_img = '/static/labour_all.png'
      second_text='Labour'
    elif(second_option == 'National'):
      second_img = '/static/national_all.png'
      second_text='National'

    if (first_option == 'Select Data' or second_option == 'Select Data'):
      return render_template("compare.html", title="Compare", errors = "Please select a dataset from the dropdown tables")
    
    return render_template("compare.html", title="Compare", images_1 = images_1, image_2 = second_img, text_1=first_txt, text_2 = second_text)
  return render_template("compare.html", title="Compare")


#Word Comparison, compares a word between the two exisiting parties
@app.route('/word_comparison', methods=['POST', 'GET'])
def word_comparison():
  #Handles post requests by searching the files for the specified word
  if (request.method == 'POST'):

    word = request.form['word'] #Requesting the word input
    #word1 = request.form['word1']
    #word2 = reqiest.form{'word2'}

    #Opening the files
    labour_file = open('static/labour_word_frequency.csv', 'r', encoding='utf8')
    l_file_raw = open('static/labour_count.csv', 'r', encoding='utf8')
    national_file = open('static/national_word_frequency.csv', 'r', encoding='utf8')
    n_file_raw = open('static/national_count.csv', 'r', encoding='utf8')
    #reading the files
    labour_text = csv.reader(labour_file)
    national_text = csv.reader(national_file)
    l_text_raw = csv.reader(l_file_raw)
    n_text_raw = csv.reader(n_file_raw)

    national_model = Word2Vec.load('static/national_stored_model.wv')
    labour_model = Word2Vec.load('static/labour_stored_model.wv')

    national_word_relation = national_model.wv.most_similar(positive=[f'{word}'])
    labour_word_relation = labour_model.wv.most_similar(positive=[f'{word}'])

    #national_word_similarity = national_model.wv.similarity(f'{word1}', f'{word2}')
    #labour_word_similarity = labour_model.wv.similarity(f'{word1}', f'{word2}')

    #labour_most_similar = labour_model.wv.most_similar(positive=[f'{word1}', f'{word2}'])
    #national_most_similar = national_model.wv.most_similar(positive=[f'{word1}', f'{word2}'])

    #Searches through the files for the word from user input
    labour_row = None
    national_row=None
    #Finds the representive percentage of the word
    for row in labour_text:
      if (row[0].lower() == word):
        labour_row = row
    for row in national_text:
      if (row[0].lower() == word):
        national_row = row

    #Searches the raw files to find the actual count of that word
    for row in l_text_raw:
      if(row[0].lower() == word):
        l_count = row[1]
    for row in n_text_raw:
      if(row[0].lower() == word):
        n_count = row[1]

    #If either search was unsuccessful, create a result to return with zero occurrences
    if labour_row == None:
      labour_row = [word, '0']

    if national_row == None:
      national_row = [word, '0']

    #If either row has zero occurances, do not make the graphs
    if national_row[1] != ' 0' and labour_row[0] != ' 0':
      national_float = float(national_row[1])
      labour_float = float(labour_row[1])

      
      total_results = national_float + labour_float
      labour_percentage = (labour_float / total_results) * 100
      national_percentage = (national_float / total_results) * 100
  
      pie = pygal.Pie()
      pie.title = 'Usage of the word ' + labour_row[0]
      pie.add('Labour', labour_percentage)
      pie.add('National', national_percentage)
      pie_data = pie.render_data_uri()
  
      graph = pygal.Bar(y_title='Percentage of total page')
      graph.title = "Usage of the word: " + labour_row[0]
      graph.add('Labour', labour_float)
      graph.add('National', national_float)
      graph_data = graph.render_data_uri()

      #Sets the party row data to the actual count once the script has completed 
      national_row[1] = n_count
      labour_row[1] = l_count
      #Returns the page with the data found from searchning the csvs
      #return render_template("word_comparison_backup_old.html", title="Word Comparison", labour_row=labour_row, national_row=national_row, graph=graph_data, pie=pie_data)
      return render_template("word_comparison.html", title="Word Comparison", labour_row=labour_row, national_row=national_row, graph=graph_data, pie=pie_data, nat_relation=national_word_relation, lab_relation=labour_word_relation)
    else:
      return render_template("word_comparison.html", title="Word Comparison", labour_row=labour_row, national_row=national_row)
  else:
    return render_template("word_comparison.html", title="Word Comparison")

@app.route('/test', methods=['POST', 'GET'])
def test():
    #Handles post requests by searching the files for the specified word
  if (request.method == 'POST'):

    word = request.form['word'] #Requesting the word input
    print(word, file=sys.stderr) #REMOVE LATER
    #Opening the files
    labour_file = open('static/labour_word_frequency.csv', encoding='utf-8')
    l_file_raw = open('static/labour_count.csv', encoding='utf-8')
    national_file = open('static/national_word_frequency.csv', encoding='utf-8')
    n_file_raw = open('static/national_count.csv', encoding='utf-8')
    #reading the files
    labour_text = csv.reader(labour_file)
    national_text = csv.reader(national_file)
    l_text_raw = csv.reader(l_file_raw)
    n_text_raw = csv.reader(n_file_raw)
    #Searches through the files for the word from user input
    labour_row = None
    national_row=None
    #Finds the representive percentage of the word
    for row in labour_text:
      if (row[0].lower() == word):
        labour_row = row
    for row in national_text:
      if (row[0].lower() == word):
        national_row = row

    #Searches the raw files to find the actual count of that word
    for row in l_text_raw:
      if(row[0].lower() == word):
        l_count = row[1]
    for row in n_text_raw:
      if(row[0].lower() == word):
        n_count = row[1]

    #If either search was unsuccessful, create a result to return with zero occurrences
    if labour_row == None:
      labour_row = [word, '0']

    if national_row == None:
      national_row = [word, '0']

    #If either row has zero occurances, do not make the graphs
    if national_row[1] != '0' and labour_row != '0':
      national_float = float(national_row[1])
      labour_float = float(labour_row[1])
      
      total_results = national_float + labour_float
      labour_percentage = (labour_float / total_results) * 100
      national_percentage = (national_float / total_results) * 100
  
      pie = pygal.Pie()
      pie.title = 'Usage of the word ' + labour_row[0]
      pie.add('Labour', labour_percentage)
      pie.add('National', national_percentage)
      pie_data = pie.render_data_uri()
  
      graph = pygal.Bar(y_title='Percentage of total page')
      graph.title = "Usage of the word: " + labour_row[0]
      graph.add('Labour', labour_float)
      graph.add('National', national_float)
      graph_data = graph.render_data_uri()

      #Sets the party row data to the actual count once the script has completed 
      national_row[1] = n_count
      labour_row[1] = l_count
      #Returns the page with the data found from searchning the csvs
      return render_template("word_comparison.html", title="Word Comparison", labour_row=labour_row, national_row=national_row, graph=graph_data, pie=pie_data)
    else:
      return render_template("word_comparison.html", title="Word Comparison", labour_row=labour_row, national_row=national_row)
  else:
    return render_template("home.html", title="Word Comparison")
  return render_template("home.html", title="Home")

@app.route('/')
@app.route('/index')
def bootstrap():
  #labour_file = open('static/labour_word_frequency.csv', 'r', encoding='utf8')
  #national_file = open('static/national_word_frequency.csv', 'r', encoding='utf8')
  national_model = Word2Vec.load('static/national_stored_model.wv')
  labour_model = Word2Vec.load('static/labour_stored_model.wv')
  national_word_relation = national_model.wv.most_similar(positive=[f'{"environment"}'])
  labour_word_relation = labour_model.wv.most_similar(positive=[f'{"labour"}'])
  return render_template('bootstraptesting.html', data=national_word_relation)

@app.route("/get_word2vec/<word>")
def get_word2vec(word):
  national_model = Word2Vec.load('static/national_stored_model.wv')
  labour_model = Word2Vec.load('static/labour_stored_model.wv')
  try:
    national_word_relation = national_model.wv.most_similar(positive=[f'{word}'])
  except:
    national_word_relation = "No Occurances"
  try:
    labour_word_relation = labour_model.wv.most_similar(positive=[f'{word}'])
  except:
    labour_word_relation = "No Occurances"
  return_dict = {"national": national_word_relation, "labour": labour_word_relation}
  return return_dict

@app.route("/get_word2vec/<word_1>/<word_2>")
def compare_word2vec(word_1, word_2):
  national_model = Word2Vec.load('static/national_stored_model.wv')
  labour_model = Word2Vec.load('static/labour_stored_model.wv')
  try:
    word_compare_nat = national_model.wv.similarity(word_1, word_2)
  except:
    return("na")
  try:
    word_compare_lab = labour_model.wv.similarity(word_1, word_2)
  except:
    return("na")
  word_compare_dict = {"nat_similarity": word_compare_nat.item(), 'lab_similarity': word_compare_lab.item()}
  return word_compare_dict



#@app.route("/parties")
#def parties():
  #labour_file = open('static/labour_word_frequency.csv', 'r', encoding='utf8')
  #national_file = open('static/national_word_frequency.csv', 'r', encoding='utf8')
  #national_model = Word2Vec.load('static/national_stored_model.wv')
  #labour_model = Word2Vec.load('static/labour_stored_model.wv')
  #national_word_relation = national_model.wv.most_similar(positive=[f'{"environment"}'])
  #labour_word_relation = labour_model.wv.most_similar(positive=[f'{'environment'}'])
  #return national_model