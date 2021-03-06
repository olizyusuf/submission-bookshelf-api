const { nanoid } = require('nanoid');
const books = require('./bookshelf');

// POST ADDBOOKS

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// GET BOOKS

const getBooksHandler = (request, h) => {
  const { bookId } = request.params;

  const bookbyid = books.filter((b) => b.id === bookId)[0];

  if (bookId !== undefined) {
    if (bookbyid === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });
      response.code(404);
      return response;
    }
    const response = h.response({
      status: 'success',
      data: {
        book: bookbyid,
      },
    });
    response.code(200);
    return response;
  }

  const { name, reading, finished } = request.query;

  if (reading !== undefined) {
    const readStat = books.filter((b) => b.reading === (reading === '1')).map((b) => ({
      id: b.id,
      name: b.name,
      publisher: b.publisher,
    }));

    if (readStat === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Data buku tidak ditemukan',
      });
      response.code(404);
      return response;
    }

    const response = h.response({
      status: 'success',
      data: {
        books: readStat,
      },
    });
    response.code(200);
    return response;
  }

  if (finished !== undefined) {
    const finishedStat = books.filter((b) => b.finished === (finished === '1')).map((b) => ({
      id: b.id,
      name: b.name,
      publisher: b.publisher,
    }));

    if (finishedStat === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Data buku tidak ditemukan',
      });
      response.code(404);
      return response;
    }

    const response = h.response({
      status: 'success',
      data: {
        books: finishedStat,
      },
    });
    response.code(200);
    return response;
  }

  if (name !== undefined) {
    const formatString = books.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()));

    const response = h.response({
      status: 'success',
      data: {
        books: formatString.map((b) => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  const book = books.map((b) => ({ id: b.id, name: b.name, publisher: b.publisher }));

  const response = h.response({
    status: 'success',
    data: {
      books: book,
    },
  });
  response.code(200);
  return response;
};

// UPDATE BOOKS

const updateBooksHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// DELETE BOOKS

const deleteBookHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((b) => b.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getBooksHandler,
  updateBooksHandler,
  deleteBookHandler,
};
