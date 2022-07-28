import json


cardsInfo = []
baseUrl = 'static/images'

def getCardInfo(cardHeading, file):
    card = {}
    cardHeading = cardHeading.replace('\n', '')
    card['heading'] = cardHeading
    card['name'] = cardHeading.lower().replace(' ', '-')

    card['images'] = {
        'svg': f'{card["name"]}.svg',
        'webp': f'{card["name"]}.webp',
        'jpg': f'{card["name"]}.jpg',
    }

    counter = 0
    card['spread'] = {}

    while counter < 3:
        line = file.readline().replace('\n', '')

        if line == '':
            continue

        if line.startswith('Spread'):
            counter += 1
            card['spread'][counter] = {}
            
            for _ in range(3):
                line = file.readline().replace('\n', '')
                splitLine = line.split(': ')

                card['spread'][counter][splitLine[0]] = splitLine[1]

    return card

with open('data.txt', 'rt', encoding='utf-8') as f:    
    counter = 0

    while counter < 52:
        line = f.readline()

        if line.__contains__('of'):
            counter += 1
            card = getCardInfo(line, f)
            cardsInfo.append(card)


with open('data.json', 'w') as f:
    json.dump(cardsInfo, f)

print('task finished')