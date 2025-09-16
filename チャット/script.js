const chatArea = document.getElementById('chatArea');
const questionsData = {
    'net-order': '【ネットオーダー】',
    'net-super': '【マイフレッセイ】',
    'other': '【アプリその他】'
};

// 新しい回答が追加されたときに先頭にスクロール
function scrollToResponseStart(responseElement) {
    responseElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// 質問と回答をセットで表示するためのスクロール関数
function scrollToQuestionAndAnswer(questionElement, answerElement) {
    // 質問の先頭にスクロール
    questionElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
    
    // 質問と回答の両方が見えるかチェック
    setTimeout(() => {
        const questionRect = questionElement.getBoundingClientRect();
        const answerRect = answerElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // 回答の下部が画面外にある場合は、質問が見える範囲で調整
        if (answerRect.bottom > viewportHeight) {
            const availableHeight = viewportHeight - questionRect.height - 20; // 20pxのマージン
            const answerContent = answerElement.querySelector('.message-content');
            
            if (answerContent && answerContent.scrollHeight > availableHeight) {
                answerContent.style.maxHeight = availableHeight + 'px';
                answerContent.style.overflowY = 'auto';
                answerContent.style.border = '1px solid #e0e0e0';
                answerContent.style.borderRadius = '8px';
                answerContent.style.padding = '10px';
                answerContent.scrollTop = 0;
            }
        }
    }, 100);
}

function showCategory(category) {
    // Hide all question containers
    const containers = document.querySelectorAll('.questions-container');
    containers.forEach(container => {
        container.classList.remove('active');
    });
    
    // Show selected category
    document.getElementById(category).classList.add('active');
    
    // Update button states
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    event.target.classList.add('active');
}

function askQuestion(question, answer) {
    // Add user question to chat
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `
        <div class="message-content">${question}</div>
    `;
    chatArea.appendChild(userMessage);
    
    // まず質問にスクロール
    scrollToResponseStart(userMessage);
    
    // Add bot response to chat
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot-message';
        botMessage.innerHTML = `
            <div class="bot-icon">
                <img src="bot-icon.jpg" alt="サポートアイコン">
            </div>
            <div class="message-content">${answer.replace(/\n/g, '<br>')}</div>
        `;
        chatArea.appendChild(botMessage);
        
        // 長い回答の場合、最大高さを制限してスクロール可能にする
        adjustLongResponse(botMessage);
        
        // 質問と回答がセットで見えるようにスクロール
        scrollToQuestionAndAnswer(userMessage, botMessage);
        
    }, 500);
}

// 長い回答を調整する関数
function adjustLongResponse(botMessage) {
    const messageContent = botMessage.querySelector('.message-content');
    const maxHeight = window.innerHeight * 0.4; // 画面の40%を最大高さとする
    
    // 実際の高さを取得
    const actualHeight = messageContent.scrollHeight;
    
    if (actualHeight > maxHeight) {
        // 長い回答の場合、スクロール可能にする
        messageContent.style.maxHeight = maxHeight + 'px';
        messageContent.style.overflowY = 'auto';
        messageContent.style.border = '1px solid #e0e0e0';
        messageContent.style.borderRadius = '8px';
        messageContent.style.padding = '10px';
        
        // 回答の先頭にスクロール位置を設定
        messageContent.scrollTop = 0;
    }
}

// 代替案: 回答を段階的に表示する関数
function askQuestionWithProgressive(question, answer) {
    // Add user question to chat
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `
        <div class="message-content">${question}</div>
    `;
    chatArea.appendChild(userMessage);
    
    // まず質問にスクロール
    scrollToResponseStart(userMessage);
    
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot-message';
        
        // 回答が長い場合は最初の部分だけ表示
        const maxPreviewLength = 200;
        const answerText = answer.replace(/\n/g, '<br>');
        
        if (answerText.length > maxPreviewLength) {
            const preview = answerText.substring(0, maxPreviewLength);
            const remaining = answerText.substring(maxPreviewLength);
            
            botMessage.innerHTML = `
                <div class="bot-icon">
                    <img src="bot-icon.jpg" alt="サポートアイコン">
                </div>
                <div class="message-content">
                    <div class="response-preview">${preview}...</div>
                    <div class="response-remaining" style="display: none;">${remaining}</div>
                    <button class="expand-btn" onclick="expandResponse(this)" style="
                        background: #007bff;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        margin-top: 10px;
                    ">続きを読む</button>
                </div>
            `;
        } else {
            botMessage.innerHTML = `
                <div class="bot-icon">
                    <img src="bot-icon.jpg" alt="サポートアイコン">
                </div>
                <div class="message-content">${answerText}</div>
            `;
        }
        
        chatArea.appendChild(botMessage);
        
        // 質問と回答がセットで見えるようにスクロール
        scrollToQuestionAndAnswer(userMessage, botMessage);
        
    }, 500);
}

// 「続きを読む」ボタンの処理
function expandResponse(button) {
    const container = button.parentElement;
    const remaining = container.querySelector('.response-remaining');
    const preview = container.querySelector('.response-preview');
    const botMessage = container.closest('.bot-message');
    const userMessage = botMessage.previousElementSibling; // 直前の質問要素
    
    // 「...」を削除
    preview.innerHTML = preview.innerHTML.replace('...', '');
    
    // 残りの部分を表示
    remaining.style.display = 'block';
    
    // ボタンを非表示
    button.style.display = 'none';
    
    // 展開後も質問と回答がセットで見えるようにスクロール調整
    setTimeout(() => {
        if (userMessage && userMessage.classList.contains('user-message')) {
            scrollToQuestionAndAnswer(userMessage, botMessage);
        } else {
            scrollToResponseStart(botMessage);
        }
    }, 100);
}

function clearChat() {
    chatArea.innerHTML = `
        <div class="bot-message">
            <div class="bot-icon">
               <img src="bot-icon.jpg" alt="サポートアイコン">
            </div>
            <div class="message-content">
                こんにちは！お問い合わせいただきありがとうございます。<br>
                下記のカテゴリーから該当するものをお選びいただき、ご質問をクリックしてください。
            </div>
        </div>
    `;
}

// スムーズスクロールの設定
chatArea.addEventListener('scroll', function() {
    chatArea.style.scrollBehavior = 'smooth';
});